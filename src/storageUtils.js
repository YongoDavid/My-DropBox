import { supabase } from './supabaseConfig';

export const storageUtils = {
  async uploadFile(file, path) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (error) throw error;

      return {
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(path) {
    try {
      const { error } = await supabase.storage
        .from('files')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async deleteFolder(folderPath) {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('files')
        .list(folderPath);

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('files')
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  },

  getFileUrl(path) {
    const { data } = supabase.storage
      .from('files')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};

export default storageUtils;