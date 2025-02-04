import { createClient } from '@supabase/supabase-js';
import { error, type RequestHandler } from '@sveltejs/kit';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase-types';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const DELETE: RequestHandler = async ({ params, locals: { session } }) => {
  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }

  const { id } = params;
  if (!id) {
    return error(400, 'Missing image ID');
  }

  const filePath = `original/${session.user.id}/${id}`;

  // Delete the file from storage
  const { error: deleteError } = await supabaseAdmin.storage.from('v2').remove([filePath]);

  if (deleteError) {
    console.error('Error deleting file:', deleteError);
    return error(500, 'Error deleting image');
  }

  return new Response(JSON.stringify({ success: true }));
};
