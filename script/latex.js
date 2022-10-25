
const puppeteer = require("puppeteer");

async function generateLatex(question, css, out) {
  let html = `
    <html>
        <head>
        <style>
            ${css == '' ? `
            body {
                      height: max-content;
                      font-size: 40px;
                      width: 700px;
                      background-color: white;
      
                  }
      
                  h1 {
                      margin: 0;
                      padding: 0;
                  }
            ` : css}
        </style>
        </head>

        <body>
        <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            CommonHTML: { linebreaks: { automatic: true } },
            "HTML-CSS": { linebreaks: { automatic: true } },
            SVG: { linebreaks: { automatic: true } }
        });
        MathJax.Hub.Queue(["Rerender",MathJax.Hub])
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_SVG-full"></script>
        $$${question}$$
        </body>
    </html>
    `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`);
  const content = await page.$("body");
  if (content != null) {
    const imageBuffer = await content.screenshot({
      omitBackground: true,
      path: out
    });

    await page.close();
    await browser.close();
  } else {
    console.log("Error");
  }
}

module.exports = {
    generateLatex
}
