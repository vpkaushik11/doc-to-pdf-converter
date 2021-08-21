const { PDFNet } = require('@pdftron/pdfnet-node');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


app.get('/',(req,res)=>{
    console.log(req.query);
    res.status(200).json({
        status: 'success',
        data: 'Hello from the other side'
    });
});

app.get('/generateInvoice', (req,res) =>{

});

app.get('/convertFromOffice', (req,res) =>{
    const { filename } = req.query;

    const inputPath = path.resolve(__dirname, `./files/${filename}`);
    const outputPath = path.resolve(__dirname,`./files/${filename}.pdf`);

    const convertToPdf = async () => {
        const pdfdoc = await PDFNet.PDFDoc.create();
        await pdfdoc.initSecurityHandler();
        await PDFNet.Convert.toPdf(pdfdoc, inputPath);
        pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    }

    PDFNet.runWithCleanup(convertToPdf).then(() => {
        fs.readFile(outputPath, (err, data) => {
            if(err){
                res.statusCode = 500;
                res.end(err);
            } else {
                res.setHeader('ContentType' , 'application/pdf');
                res.end(data);
            }
        });
    }).catch(err => {
        res.statusCode = 500;
        res.end(err);

    });
});

app.listen(4000, ()=>{
    console.log(`App is Running`);
});

// typing NPM start in the terminal will initiate Nodemon
// http://localhost:4000/convertFromOffice?filename=Problemset1.docx typing this in browser gives the result 