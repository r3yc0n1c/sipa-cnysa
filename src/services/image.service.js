const imageProcQueue = require("../config/bullmq");

const processImage = async (inputUrl) => {
    const response = await axios.get(inputUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    
    const processedBuffer = await sharp(buffer)
      .jpeg({ quality: 50 })
      .toBuffer();
  
    const outputFilename = `processed-${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, '..', 'uploads', outputFilename);
    await fs.writeFile(outputPath, processedBuffer);
  
    return `/uploads/${outputFilename}`;
  };
  