No content yet
      case "cmd_line": {
        const parsed = CmdLineArgsSchema.safeParse(args);
        if (!parsed.success) {
          throw new Error(`Invalid arguments for cmd_line: ${parsed.error}`);
        }
        
        // Validate working directory if provided
        let workDir = process.cwd();
        if (parsed.data.workingDir) {
          workDir = await validatePath(parsed.data.workingDir);
        }
        
        const { exec } = await import('child_process');
        const util = await import('util');
        const execPromise = util.promisify(exec);
        
        try {
          const { stdout, stderr } = await execPromise(
            `${parsed.data.command} ${parsed.data.args?.join(' ') || ''}`,
            { cwd: workDir }
          );
          return {
            content: [{ type: "text", text: stdout + stderr }],
          };
        } catch (error: any) {
          throw new Error(`Command execution failed: ${error.message}`);
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }
});

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.listen(transport);
