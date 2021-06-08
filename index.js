const fs   = require("fs");
const path = require("path");

const { sources,Compilation } = require("webpack");

const HTACCESS_SRC_FILENAME = path.join(__dirname,"src.htaccess");

module.exports = class PhpIndexWebpackPlugin
{
	constructor(options)
	{
		this.phpEntry 		 = options.phpEntry||"./src/index.php";
		this.includeHtaccess = "includeHtaccess" in options
								 ?options.includeHtaccess
								 :true;
		this.distPathConst	 = options.distPathConst||null;
	}

	apply(compiler)
	{
		const indexFilename 		= path.join(compiler.outputPath,"index.php"),
			  relPhpEntry   		= path.relative(indexFilename,this.phpEntry),
			  shouldIncludeHtaccess = this.includeHtaccess,
			  htaccessSrcFilename	= (typeof this.includeHtaccess)=="string"
			  							?this.includeHtaccess
			  							:HTACCESS_SRC_FILENAME;
		let indexContents = "<?php ";
		if ((typeof this.distPathConst)=="string")
			indexContents += `define("${this.distPathConst}",__DIR__);`;
		indexContents += `require("${relPhpEntry}");`;

		compiler.hooks.compilation.tap("PhpIndexWebpackPlugin",function(compilation)
		{
			compilation.hooks.processAssets.tap(
				{
					'name':"PhpIndexWebpackPlugin",
					'stage':Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				},
				function(assets)
				{
					compilation.emitAsset("index.php",new sources.RawSource(indexContents));

					if (shouldIncludeHtaccess)
						compilation.emitAsset(".htaccess",new sources.OriginalSource(
							fs.readFileSync(fs.openSync(htaccessSrcFilename,"r")),
							htaccessSrcFilename,
							{copied:true,sourceFilename:htaccessSrcFilename},
						));
				}
			);
		});
	}
};