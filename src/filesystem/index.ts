import { z } from 'zod';
import { allowedDirectories } from './allowed-directories';

const CmdLineArgsSchema = z.object({
  action: z.enum(['list_allowed_directories', 'cmd_line']),
  args: z.array(z.string()).optional(),
});

export async function handleFilesystemRequest(request: {
  action: string;
  args?: string[];
}): Promise<{ content: any[] }> {
  const parsed = CmdLineArgsSchema.safeParse(request);
  if (!parsed.success) {
    return {
      content: [{ type: 'error', text: 'Invalid request format' }],
    };
  }

  switch (parsed.data.action) {
    case 'list_allowed_directories': {
      return {
        content: [{ 
          type: 'text',
          text: `Allowed directories:\n${allowedDirectories.join('\n')}`
        }]
      };
    }

    case 'cmd_line': {
      const parsed = CmdLineArgsSchema.safeParse(request.args);
      if (!parsed.success) {
        return {
          content: [{ type: 'error', text: 'Invalid command line arguments' }],
        };
      }

      // Handle the command line request
      return {
        content: [{ type: 'text', text: 'Command line request handled' }],
      };
    }

    default: {
      return {
        content: [{ type: 'error', text: 'Unknown action' }],
      };
    }
  }
}
