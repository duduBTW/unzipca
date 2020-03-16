// hoge.rar => output/...
const { unrar, list } = require("unrar-promise");
const http = require("http");
var ftp = require("ftp-get");
const fs = require("fs");
const readline = require("readline");
const { appendFile } = require("fs").promises;

const filename = "tgg_export_caepi";
const file = fs.createWriteStream(filename);

ftp.get(
  "ftp://ftp.mtps.gov.br/portal/fiscalizacao/seguranca-e-saude-no-trabalho/caepi/tgg_export_caepi.zip",
  `${__dirname}/${filename}.rar`,
  function(error, result) {
    if (error) {
      console.error(error);
    } else {
      console.log("File downloaded at: " + result);
      descompactar();
    }
  }
);

function descompactar() {
  const dirPath = unrar(`tgg_export_caepi.rar`, "output", {
    overwrite: true
  });
}

const rl = readline.createInterface({
  input: fs.createReadStream(`output/${filename}.txt`, "utf8"),
  // input: fs.createReadStream(`${filename}.txt`, "utf8"),
  crlfDelay: Infinity
});

let itens = [];
rl.on("line", line => {
  var nameArr = line.split("|");

  let item = {
    NRRegistroCA: nameArr[0],
    DataValidade: nameArr[1],
    Situacao: nameArr[2],
    CNPJ: nameArr[3],
    RazaoSocial: nameArr[4],
    Natureza: nameArr[5],
    NomeEquipamento: nameArr[6],
    DescricaoEquipamento: nameArr[7],
    MarcaCA: nameArr[8],
    Referencia: nameArr[7],
    Cor: nameArr[8],
    AprovadoParaLaudo: nameArr[9],
    RestricaoLaudo: nameArr[10],
    ObservacaoAnaliseLaudo: nameArr[11],
    CNPJLaboratorio: nameArr[12],
    RazaoSocialLaboratorio: nameArr[13],
    NRLaudo: nameArr[14],
    Norma: nameArr[15]
  };
  itens.push(item);
}).on("close", () => {
  itens.shift();
  gravarItens(itens);
  process.exit(0);
});

function gravarItens(itensGravar) {
  var jsonContent = JSON.stringify(itensGravar);
  fs.writeFileSync("file.json", jsonContent);
}
