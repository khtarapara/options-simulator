import * as XLSX from "xlsx";

export const round = (num, points = 2) => {
  const multiplier = Math.pow(10, points);
  return Math.round(num * multiplier) / multiplier;
};

export const strToNumber = (str) => Number(str) || 0;

export const strToNumberRound = (str, points) =>
  round(strToNumber(str), points);

export const isFn = (v) => typeof v === "function";

export const readExcel = (file) => {
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {
        raw: false,
      });
      resolve(data);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  return promise;
};
