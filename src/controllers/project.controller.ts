import type { Request, Response } from 'express';
import { supabase } from '@/lib/supabase';

// GET /projects
export async function getAll(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
}

// GET /projects/:id
export async function getOne(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ message: 'Project not found' });

  res.json(data);
}

// POST /projects — admin only (enforced in route)
export async function create(req: Request, res: Response) {
  const { name, description } = req.body;
  const { userId } = req.user!;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ name, description, created_by: userId })
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json(data);
}

// PUT /projects/:id — admin only (enforced in route)
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description } = req.body;

  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) return res.status(404).json({ message: 'Project not found' });

  const { data, error } = await supabase
    .from('projects')
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
}

// DELETE /projects/:id — admin only (enforced in route)
export async function remove(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return res.status(500).json({ message: error.message });

  res.status(204).send();
}