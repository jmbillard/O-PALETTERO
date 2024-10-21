// Emojis e mensagens (opcional)
var lol = 'Σ(っ °Д °;)っ        ';
var relax = 'ヽ(✿ﾟ▽ﾟ)ノ        ';
var appV = parseInt(app.buildName.substring(0, 2));

var lClick = '◖   →  ';
var rClick = ' ◗  →  ';
var dClick = '◖◖ →  ';

// Cores do Style Guide GLOBO
var bgColor1 = '#0B0D0E';
var bgColor2 = '#060F13';
var divColor1 = '#002133';
var divColor2 = '#004266';
var monoColor0 = '#F2F2F2';
var monoColor1 = '#C7C8CA';
var monoColor2 = '#939598';
var monoColor3 = '#4B4C4E';
var normalColor1 = '#05A6FF';
var normalColor2 = '#80D2FF';
var highlightColor1 = '#8800f8';
var highlightColor2 = '#8640BF';

// Caminhos para as preferências do script e pasta temporária
var scriptPreferencesPath = Folder.userData.fullName + '/O PALETTERO script';
var scriptPreferencesFolder = new Folder(scriptPreferencesPath);
if (!scriptPreferencesFolder.exists) scriptPreferencesFolder.create();

// ---------------------------------------------------------------------------------

// Define os valores padrão das preferências do usuário.
var PAL_defaultPreferencesObj = {
	swatches: [
		{
			color: '#F13333',
			label: 'cor 1'
		},
		{
			color: '#FF4D4D',
			label: 'cor 2'
		},
		{
			color: '#FE674C',
			label: 'cor 3'
		},
		{
			color: '#FF8F4D',
			label: 'cor 4'
		},
		{
			color: '#FFC44E',
			label: 'cor 5'
		},
		{
			color: '#5DE6A2',
			label: 'cor 6'
		},
		{
			color: '#80C0FE',
			label: 'cor 7'
		},
		{
			color: '#B5ADFF',
			label: 'cor 8'
		},
		{
			color: '#FF8CCD',
			label: 'cor 9'
		},
		{
			color: '#FF739A',
			label: 'cor 10'
		},
		{
			color: '#FF5A68',
			label: 'cor 11'
		}
	],

	showColorLabels: false,
	showColorInfo: true,
	labelType: '#HEX'
};

var PAL_preferencesObj = loadDefaultPreferences();
var showColorLabels = PAL_preferencesObj.showColorLabels;
var showColorInfo = PAL_preferencesObj.showColorInfo;
var labelType = PAL_preferencesObj.labelType;
