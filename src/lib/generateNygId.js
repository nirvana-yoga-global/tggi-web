import { supabase } from './supabase'

export async function generateNygId() {
  const year = new Date().getFullYear()
  const prefix = `NYG-G-${year}-`

  const { data, error } = await supabase
    .from('tggi_registrations')
    .select('nyg_id')
    .like('nyg_id', `${prefix}%`)
    .order('nyg_id', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is fine
    throw new Error(`Failed to generate NYG ID: ${error.message}`)
  }

  let nextNumber = 1

  if (data?.nyg_id) {
    const parts = data.nyg_id.split('-')
    const lastNumber = parseInt(parts[3], 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  return `${prefix}${String(nextNumber).padStart(3, '0')}`
}
