import type { Request, Response } from 'express';
import { supabase } from '@/lib/supabase';

// GET /tasks — fetch tasks based on role
// admin: sees all tasks | member: sees only their own
export async function getAll(req: Request, res: Response) {
  const { userId, role } = req.user!;

  const query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  // Members can only see their own tasks
  if (role === 'member') {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
}

// GET /tasks/:id — fetch a single task
export async function getOne(req: Request, res: Response) {
  const { id } = req.params;
  const { userId, role } = req.user!;

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ message: 'Task not found' });

  // Members can only view their own tasks
  if (role === 'member' && data.user_id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(data);
}

// POST /tasks — create a new task (assigned to the current user)
export async function create(req: Request, res: Response) {
  const { title, description } = req.body;
  const { userId } = req.user!;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, description, user_id: userId, status: 'pending' })
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json(data);
}

// PUT /tasks/:id — update a task
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const { userId, role } = req.user!;

  // Verify task exists first
  const { data: existing, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Members can only update their own tasks
  if (role === 'member' && existing.user_id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ title, description, status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
}

// DELETE /tasks/:id — admin only (enforced in route)
export async function remove(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) return res.status(500).json({ message: error.message });

  res.status(204).send();
}