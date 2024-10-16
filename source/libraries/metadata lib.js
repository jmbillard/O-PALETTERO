/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/*

---------------------------------------------------------------
> 📃 script metadata
---------------------------------------------------------------

*/

// Carrega a biblioteca XMP (se ainda não estiver carregada).
if (ExternalObject.AdobeXMPScript == undefined) {
	ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
}

// Obtém um valor de metadado XMP do projeto atual.
function getXMPData(XMPfield) {
	var metaData = new XMPMeta(app.project.xmpPacket); // Cria um objeto XMPMeta a partir dos metadados do projeto
	var XMPSet = XMPConst.NS_DC; // Define o namespace XMP a ser usado (Dublin Core, neste caso)

	// Verifica se a propriedade XMP existe e retorna seu valor, ou uma string vazia se não existir
	return metaData.doesPropertyExist(XMPSet, XMPfield)
		? metaData.getProperty(XMPSet, XMPfield).value
		: '';
}

// Define um valor de metadado XMP no projeto atual.
function setXMPData(XMPfield, XMPval) {
	var metaData = new XMPMeta(app.project.xmpPacket); // Cria um objeto XMPMeta a partir dos metadados do projeto
	var XMPSet = XMPConst.NS_DC; // Define o namespace XMP a ser usado

	// Remove a propriedade existente (se houver) e define o novo valor
	metaData.deleteProperty(XMPSet, XMPfield);
	metaData.setProperty(XMPSet, XMPfield, XMPval);

	// Atualiza os metadados do projeto
	app.project.xmpPacket = metaData.serialize();
}

// function PAL_registerNamespace() {


// }

// function PAL_saveMetadata(key, value) {

// 	// Registrar o namespace
// 	var namespaceURI = 'http://ns.adobe.com/o_palettero/1.0/';
// 	var registeredPrefix = XMPMeta.registerNamespace(namespaceURI, 'o_palettero');

// 	// Obter os metadados existentes
// 	var myXMP = new XMPMeta(app.project.xmpPacket);

// 	// Definir o novo valor de metadados
// 	myXMP.setProperty(namespaceURI, key, value, XMPConst.STRING);

// 	// Armazenar os metadados atualizados
// 	var myPacket = myXMP.serialize();
// 	app.project.xmpPacket = myPacket;

// 	return true;
// }

// // Exemplo de uso:
// // PAL_saveMetadata('paleta', '#FFFFFF-#000000-#FF0000-#00FF00-#0000FF-#FFFF00-#FF00FF-#00FFFF');

// function PAL_getMetadata(key) {

//     // Carregar pacote XMP existente
//     var myXMP = new XMPMeta(app.project.xmpPacket);
    
//     // Recuperar o valor
// 	var namespaceURI = 'http://ns.adobe.com/o_palettero/1.0/';
//     var myValue = myXMP.getProperty(namespaceURI, key);
//     return myValue ? myValue.toString() : null;
// }

// // Exemplo de uso:
// var paleta = PAL_getMetadata("paleta");
// alert(paleta); // Deve exibir "#FFFFFF"

