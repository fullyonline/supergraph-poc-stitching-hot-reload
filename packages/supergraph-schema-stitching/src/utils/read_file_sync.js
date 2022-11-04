import fs  from 'fs';
import path from 'path';

export function readFileSync(dir, filename) {
    return fs.readFileSync(path.join(dir, filename), 'utf8');
};