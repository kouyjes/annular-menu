import typescript from 'rollup-plugin-typescript';
export default {
	banner:'/* menus */',
	entry: 'src/js/index.ts',
	dest: 'dest/menu.js',
	moduleName: 'HERE.UI',
	format: 'umd',
	plugins:[
		typescript()
	]
};
