import { program } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function initRepo(projectName: string) {
  console.log(`Initializing new repository: ${projectName}`);
  fs.mkdirSync(projectName);
  process.chdir(projectName);
  execSync('git init');
}

function cloneContents(repoUrl: string) {
  const tempDir = fs.mkdtempSync('temp-clone-');
  execSync(`git clone ${repoUrl} ${tempDir}`);
  
  
    fs.readdirSync(tempDir).forEach(file => {
      if (file !== '.git') {
        fs.cpSync(path.join(tempDir, file), file, { recursive: true });
      }
    });
  
  fs.rmSync(tempDir, { recursive: true, force: true });
}
function createFilecoinApp(projectName: string, repoUrl: string, folderPath: string) {
  initRepo(projectName);
  cloneContents(repoUrl);
  console.log(`Successfully created ${projectName}!`);
}

program
  .version('1.0.0')
  .description('CLI to create a new Filecoin app')
  .argument('<project-name>', 'Name of the new project')
  .option('-r, --repo <url>', 'URL of the repository to clone from', 'https://github.com/FIL-Builders/fil-frame.git')
  .action((projectName, options) => {
    createFilecoinApp(projectName, options.repo, options.folder);
  });

program.parse(process.argv);