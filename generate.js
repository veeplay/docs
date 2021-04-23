const fs = require('fs');
const path = require('path');

const generate = (input, output, className) => {
  const inputPath = path.join(__dirname, 'sources', ...input);
  const outputPath = path.join(__dirname, 'src', 'pages', output);

  fs.mkdirSync(outputPath, { recursive: true });

  fs.readdirSync(inputPath).forEach((file) => {
    const filePath = path.join(inputPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      generate(input.concat([file]), output, className);
    }

    if (filePath.endsWith('.html')) {
      const outputFilePath = path.join(outputPath, ...input.slice(1), `${file.replaceAll(' ', '_')}.jsx`);

      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
      fs.writeFileSync(outputFilePath, `
        import ${className} from '${Array(input.length + 1).fill('..').join('/')}/components/${className}';
        import htmlContent from '${Array(input.length + 2).fill('..').join('/')}/sources/${input.join('/')}/${file}';

        export default ${className}(htmlContent);
      `);
    }
  });
};

generate(['iossdk'], 'ios-player', 'IOSSDKLayout');
generate(['jssdk'], 'javascript-player', 'JSSDKLayout');
