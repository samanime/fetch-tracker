import { writeFile as writeFileCallback } from 'fs';
import { join } from 'path';
import mkdirpCallback from 'mkdirp';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonJs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const promisify = method => (...args) => new Promise((resolve, reject) =>
  method.apply(method, args.concat(err => err ? reject(err) : resolve())));

const writeFile = promisify(writeFileCallback);
const mkdirp = promisify(mkdirpCallback);

const dir = join(__dirname, 'dist');
const fileName = 'fetch-tracker';

const inputOptions = {
  input: join(__dirname, 'src/index.js'),
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', { modules: false }]],
      plugins: ['external-helpers']
    }),
    nodeResolve(),
    commonJs()
  ]
};

const minInputOptions = Object.assign({}, inputOptions, {
  plugins: inputOptions.plugins.concat(uglify())
});

const outputOptions = {
  format: 'cjs',
  sourcemap: true
};

async function buildWith(options, name) {
  const bundle = await rollup(options);

  const { code, map } = await bundle.generate(outputOptions);

  await writeFile(join(dir, `${name}.js`), code);
  await writeFile(join(dir, `${name}.js.map`), map);
}

async function build() {
  await mkdirp(dir);
  await buildWith(inputOptions, fileName);
  await buildWith(minInputOptions, `${fileName}.min`);
}

build()
  .then(() => console.log('Build complete.'))
  .catch(err => console.log(`Build error: ${err}`));