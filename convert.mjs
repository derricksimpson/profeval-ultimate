import fs from 'fs/promises';
import path from 'path';

const csvFilePath = path.resolve('./data/schools.csv');
const jsonFilePath = path.resolve('./data/universities.json');

const readCSV = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const records = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((acc, header, index) => {
        acc[header] = header === 'ID' || header === 'RegionID' ? Number(values[index]) : values[index];
        return acc;
      }, {});
    });
    return records;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return [];
  }
};

const saveDataToJson = async (filePath, data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf-8');
    console.log('Data successfully saved to', filePath);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

const processCSVToJson = async () => {
  const data = await readCSV(csvFilePath);
  await saveDataToJson(jsonFilePath, data);
};

processCSVToJson();
