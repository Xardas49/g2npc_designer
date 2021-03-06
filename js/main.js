﻿var container, controls;
var camera, scene, renderer;
var curr_name, curr_guild, curr_id, curr_voice, curr_flags, curr_npctype;
var auto_att, auto_talents;
var curr_att;
var hp,str,dex,mana;
var melee_name,ranged_name,melee_inst,ranged_inst, curr_inv;
var bodyid,headid;
var curr_bodytex, curr_headtex, curr_bodymodel, curr_headmodel, curr_outfit;
var outfit = true;
var loaded = false;
var BodyTableMale = [0,1,2,3,8,9,10];
var BodyTableFemale = [4,5,6,7,11,12];
var HeadTableFemale = [0,1,2,3,4,5,6,7,8,9,10];
var HeadTableMale = [11,12,13,14,15,16];
var FaceTableMale0 = [19,39,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,19];
var FaceTableMale1 = [0,1,2,3,5,6,7,9,10,13,14,16,18,20,21,22,23,24,25,26,27,31,32,33,34,35,36,37,38,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119];
var FaceTableMale2 = [15,29,30,40,120,121,122,123,124,125,126,127,128];
var FaceTableMale3 = [4,11,12,17,28,129,130,131,132,133,134,135,136];
var FaceTableFemale = [137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157];
var currFaceTable;
var currBodyTable;
var currHeadTable;
var speed = 1.0;
var bodymesh = new THREE.Object3D();
var headmesh = new THREE.Object3D();
var permalink;

var noop = function() {};
var renderGif = noop;
if (!window.location.hash)
{
	window.location.hash = "2-1-0-0-2-true";
}
if (window.location.hash) {
	permalink = window.location.hash.substring(1).split('-');
	[curr_bodymodel, 
	 curr_headmodel, 
	 curr_outfit, 
 	 curr_bodytex, 
	 curr_headtex,
	 outfit] = permalink;
	 document.getElementById("range0").value = curr_bodymodel;
	 document.getElementById("range1").value = curr_headmodel;
	 document.getElementById("range6").value = curr_outfit;
	 document.getElementById("range3").value = curr_bodytex;
	 document.getElementById("range4").value = curr_headtex;
	 document.getElementById("check2").checked = (outfit == 'true');
}
init();

updateCode();

animate();

function refreshNPC()
{
	while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
	}
	scene.add( new THREE.HemisphereLight() );
	var loader = new THREE.TDSLoader( );
	var tgaloader = new THREE.TGALoader();
	if (document.getElementById("range6").value > 0 && outfit == true)
	{
		var addtexture = tgaloader.load( 'models/textures/armors/armor'+document.getElementById("range6").value+'_add.tga' );
		var addmaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: addtexture } );
		var bodytexture = tgaloader.load( 'models/textures/Hum_Body_Naked_V'+currBodyTable[curr_bodytex]+'_C0.tga' );
		var bodymaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: bodytexture } );
		var texture = tgaloader.load( 'models/textures/armors/armor'+document.getElementById("range6").value+'.tga' );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
		loader.load( 'models/armors/armor'+document.getElementById("range6").value+'.3ds', function ( object ) {
			object.name = "body";
			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
					if (child.material.name == "BODYMATERIAL")
					{
						child.material = bodymaterial;
					}else if (child.material.name == "ADD_MATERIAL")
					{
						child.material = addmaterial;
					}
					else
					{
						child.material = material;
					}
				}

			} );
			bodyid = object.id;
			scene.add( object );
		});
	}else
	{
	var texture = tgaloader.load( 'models/textures/Hum_Body_Naked_V'+currBodyTable[curr_bodytex]+'_C0.tga' );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
	loader.load( 'models/body/body'+document.getElementById("range0").value+'.3ds', function ( object ) {
		object.name = "body";
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {
				if (child.material.name == "BODYMATERIAL")
				{
					child.material = material;
				}
			}

		} );
		bodyid = object.id;
		scene.add( object );
	});
	}
	var loader2 = new THREE.TDSLoader( );
	var tgaloader = new THREE.TGALoader();
	var texture2 = tgaloader.load( 'models/textures/faces/Hum_Head_V'+currFaceTable[curr_headtex]+'_C0.tga' );
	var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2 } );
	loader2.load( 'models/head/'+currHeadTable[curr_headmodel]+'.3ds', function ( object ) {
		object.name = "head";
		object.rotation.z = 1.57;
		object.rotation.y = 1.57;
		object.position.y = 0.68;
		object.traverse( function ( child ) 
		{
			if ( child instanceof THREE.Mesh ) 
			{
				child.material = material2;
			}
		} 
		);
		headid = object.id;
		scene.add( object );
	});
	loaded = true;
}
function init() 
{
	container = document.getElementById( 'render' );
	document.getElementById( 'panel' ).style.height = window.innerHeight-112 + "px";
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth/2 / (window.innerHeight-180), 0.1, 10 );
	camera.position.z = 2;
	camera.position.y = -0.2;
	scene = new THREE.Scene();
	curr_bodytex = 0;
	curr_headtex = 0;
	curr_bodymodel = document.getElementById("range0").value;
	curr_headmodel = document.getElementById("range1").value;
	curr_outfit = document.getElementById("range6").value;
	
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth/2, window.innerHeight-180 );
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener( 'change', render );
	window.addEventListener( 'resize', auto_resize, false );
	loaded = true;
}
function resize(width, height) 
{
	var width = width || (window.innerWidth/2);
	var height = height || (window.innerHeight-180);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
}
function auto_resize() 
{
	camera.aspect = window.innerWidth/2 / (window.innerHeight-180);
	renderer.setSize( window.innerWidth/2, window.innerHeight-180 );
	camera.updateProjectionMatrix();
}
function render() 
{
	document.getElementById( 'panel' ).style.height = window.innerHeight-112 + "px";
	if (headid != -1 && bodyid != -1)
	{
		for ( var i = 0, l = scene.children.length; i < l; i ++ ) 
		{
			var child = scene.children[ i ]; 
			if ( child.id == bodyid ) 
			{ 
				bodymesh = child; 
			}
			else if ( child.id == headid ) 
			{ 
				headmesh = child; 
			}
		}
		if (document.getElementById("check1").checked == true)
		{
			bodymesh.rotation.y -= speed * 0.02617993877991494;
			headmesh.rotation.y -= speed * 0.02617993877991494;
		}
		bodymesh.scale.z = document.getElementById("range2").value;
		document.getElementById( 'label5' ).innerHTML = "Grubość: "+document.getElementById("range2").value;
		var tgaloader = new THREE.TGALoader();
		if (curr_headtex != document.getElementById("range4").value)
		{
			curr_headtex = document.getElementById("range4").value
			updateCode();
			var texture2 = tgaloader.load( 'models/textures/faces/Hum_Head_V'+currFaceTable[curr_headtex]+'_C0.tga' );
			var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture2 } );
			headmesh.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh) {
						child.material = material2;
					}
				} );	
		}
		if (curr_bodytex != document.getElementById("range3").value || curr_bodymodel != document.getElementById("range0").value || curr_headmodel != document.getElementById("range1").value || curr_outfit != document.getElementById("range6").value||outfit != document.getElementById("check2").checked)
		{
			if (loaded)
			{
				bodyid = -1;
				headid = -1;
				loaded = false;
				curr_bodymodel = document.getElementById("range0").value;
				curr_headmodel = document.getElementById("range1").value;
				curr_outfit = document.getElementById("range6").value;
				curr_bodytex = document.getElementById("range3").value
				curr_headtex = document.getElementById("range4").value
				outfit = document.getElementById("check2").checked
				updateCode();
				setTimeout(refreshNPC,100);
				//refreshNPC();		
			}
		}
		//else if (curr_name != document.getElementById( 'input_name' ).value || curr_guild != document.getElementById( 'input_guild' ).value || curr_id != document.getElementById( 'input_id' ).value)
		//{
			
			updateCode();
		//}
		
		renderer.render( scene, camera );
	}
}
function updateCode()
{
	curr_name = document.getElementById( 'input_name' ).value;
	curr_guild = document.getElementById( 'input_guild' ).value;
	curr_id =  document.getElementById( 'input_id' ).value;
	curr_voice = document.getElementById( 'input_voice' ).value;
	auto_att = document.getElementById("checkbox-3").checked;
	auto_talents = document.getElementById("checkbox-4").checked;
	curr_npctype = "NPCTYPE_"+document.getElementById( 'input_type' ).value;
	if (auto_att == true)
	{
		document.getElementById("input_hp").setAttribute("disabled", "");
		document.getElementById("input_str").setAttribute("disabled", "");
		document.getElementById("input_dex").setAttribute("disabled", "");
		document.getElementById("input_mana").setAttribute("disabled", "");
		document.getElementById("input_statchapter").removeAttribute("disabled", "");
	}else{
		document.getElementById("input_hp").removeAttribute("disabled", "");
		document.getElementById("input_str").removeAttribute("disabled", "");
		document.getElementById("input_dex").removeAttribute("disabled", "");
		document.getElementById("input_mana").removeAttribute("disabled", "");
		document.getElementById("input_statchapter").setAttribute("disabled", "");
	}
	if (auto_talents == true)
	{
		document.getElementById("skills").setAttribute("hidden", "");
	}
	else
	{
		document.getElementById("skills").removeAttribute("hidden", "");
	}
	hp = document.getElementById( 'input_hp' ).value;
	str = document.getElementById( 'input_str' ).value;
	dex = document.getElementById( 'input_dex' ).value;
	mana = document.getElementById( 'input_mana' ).value;
	
	if (document.getElementById("checkbox-1").checked == true)
	{
		curr_flags = "NPC_FLAG_IMMORTAL";
		if (document.getElementById("checkbox-2").checked == true)
		{
			curr_flags += "|NPC_FLAG_GHOST"
		}
	}
	else if (document.getElementById("checkbox-2").checked == true)
	{
		curr_flags = "NPC_FLAG_GHOST";
	}
	else curr_flags = "0";
	
	if (document.getElementById("checkbox-3").checked == true)
	{
		curr_att = "B_SetAttributesToChapter (self, "+document.getElementById("input_statchapter").value+");"
	}
	else
	{
		curr_att = "attribute[ATR_STRENGTH]\t= "+str+";\n\tattribute[ATR_DEXTERITY]\t= "+dex+";\n\tattribute[ATR_MANA_MAX]\t= "+mana+";\n\tattribute[ATR_MANA]\t= "+mana+";\n\tattribute[ATR_HITPOINTS_MAX]\t= "+hp+";\n\tattribute[ATR_HITPOINTS]\t= "+hp+";";
	}
	curr_att += "\n\tfight_tactic\t= FAI_HUMAN_"+document.getElementById("input_fight").value+";"
	if (document.getElementById("checkbox-4").checked == true)
	{
		curr_att += "\n\tB_GiveNpcTalents (self);";
	}
	melee_inst = document.getElementById( 'input_melee' ).value.split("+")[0];
	melee_name = document.getElementById( 'input_melee' ).value.split("+")[1];
	ranged_inst = document.getElementById( 'input_ranged' ).value.split("+")[0];
	ranged_name = document.getElementById( 'input_ranged' ).value.split("+")[1];
	curr_inv = "";
	if (document.getElementById( 'input_melee' ).value == "NONE")
	{
		document.getElementById( 'meleelink' ).setAttribute("hidden", "");
		document.getElementById( 'meleeimg' ).setAttribute("hidden", "");
		
	}else
	{
		document.getElementById( 'meleelink' ).removeAttribute("hidden", "");
		document.getElementById( 'meleeimg' ).removeAttribute("hidden", "");
		document.getElementById( 'meleeimg' ).setAttribute("src", "http://www.gothic.phx.pl/gothic2/dane/bronie/"+removeDiacritics(melee_name.toLowerCase())+".gif");
		document.getElementById( 'meleelink' ).setAttribute("href", "http://pl.gothic.wikia.com/"+melee_name);
		curr_inv += "\n\tEquipItem\t(self, "+melee_inst+");";
	}
	if (document.getElementById( 'input_ranged' ).value == "NONE")
	{
		document.getElementById( 'rangedlink' ).setAttribute("hidden", "");
		document.getElementById( 'rangedimg' ).setAttribute("hidden", "");

	}else
	{
		document.getElementById( 'rangedlink' ).removeAttribute("hidden", "");
		document.getElementById( 'rangedlink' ).setAttribute("href", "http://pl.gothic.wikia.com/"+ranged_name);
		document.getElementById( 'rangedimg' ).removeAttribute("hidden", "");
		document.getElementById( 'rangedimg' ).setAttribute("src", "http://www.gothic.phx.pl/gothic2/dane/bronie/dystansowe/"+removeDiacritics(ranged_name.toLowerCase())+".gif");
		curr_inv += "\n\tEquipItem\t(self, "+ranged_inst+");";
	}
	if (document.getElementById("checkbox-5").checked == true)
	{
		curr_inv += "\n\tB_CreateAmbientInv(self);";
	}	
	var v1, v2, v3, armorname;
	if (curr_bodymodel == 1)
	{ 
		v1 = "FEMALE"; 
		//document.getElementById( 'label1' ).innerHTML = "Model ciała: Żeński";
		currBodyTable = BodyTableFemale;
		currHeadTable = HeadTableFemale;
		currFaceTable = FaceTableFemale;
	}
	else 
	{
		v1 = "MALE";
		//document.getElementById( 'label1' ).innerHTML = "Model ciała: Męski";
		currBodyTable = BodyTableMale;
		currHeadTable = HeadTableMale;
		if (currBodyTable[curr_bodytex] == '0')
		{
			currFaceTable = FaceTableMale0;
		}
		else if (currBodyTable[curr_bodytex] == '1')
		{
			currFaceTable = FaceTableMale1;
		}
		else if (currBodyTable[curr_bodytex] == '2')
		{
			currFaceTable = FaceTableMale2;
		}
		else if (currBodyTable[curr_bodytex] == '3')
		{
			currFaceTable = FaceTableMale3;
		}else
		{
			currFaceTable = FaceTableMale1;
		}
	}
	document.getElementById( 'range3' ).max = currBodyTable.length-1;
	document.getElementById( 'range1' ).max = currHeadTable.length-1;
	document.getElementById("range4").max = currFaceTable.length-1;
	
	curr_bodymodel = document.getElementById("range0").value;
	curr_headmodel = document.getElementById("range1").value;
	curr_outfit = document.getElementById("range6").value;
	curr_bodytex = document.getElementById("range3").value
	curr_headtex = document.getElementById("range4").value
	switch (currHeadTable[curr_headmodel])
	{
		case 1:
			v2 = "HUM_HEAD_BABE";
			break;
		case 2:
			v2 = "HUM_HEAD_BABE1";
			break;
		case 3:
			v2 = "HUM_HEAD_BABE2";
			break;
		case 4:
			v2 = "HUM_HEAD_BABE3";
			break;
		case 5:
			v2 = "HUM_HEAD_BABE4";
			break;
		case 6:
			v2 = "HUM_HEAD_BABE5";
			break;
		case 7:
			v2 = "HUM_HEAD_BABE6";
			break;
		case 8:
			v2 = "HUM_HEAD_BABE7";
			break;
		case 9:
			v2 = "HUM_HEAD_BABE8";
			break;
		case 10:
			v2 = "HUM_HEAD_BABEHAIR";
			break;
		case 11:
			v2 = "HUM_HEAD_BALD";
			break;
		case 12:
			v2 = "HUM_HEAD_FATBALD";
			break;
		case 13:
			v2 = "HUM_HEAD_FIGHTER";
			break;
		case 14:
			v2 = "HUM_HEAD_PONY";
			break;
		case 15:
			v2 = "HUM_HEAD_PSIONIC";
			break;
		case 16:
			v2 = "HUM_HEAD_THIEF";
			break;
		default:
			v2 = "HUM_HEAD_PONY";
	}
	switch (curr_outfit)
	{
		case '0':
			v3 = "0";
			armorname = "Brak";
			break;
		case '1':
			v3 = "ITAR_BAU_L";
			armorname = "Strój farmera I";
			break;
		case '2':
			v3 = "ITAR_BAU_M";
			armorname = "Strój farmera II";
			break;
		case '3':
			v3 = "ITAR_BauBabe_L";
			armorname = "Suknia farmerki I";
			break;
		case '4':
			v3 = "ITAR_BauBabe_M";
			armorname = "Suknia farmerki II";
			break;
		case '5':
			v3 = "ITAR_VlkBabe_L";
			armorname = "Suknia obywatelki I";
			break;
		case '6':
			v3 = "ITAR_VlkBabe_M";
			armorname = "Suknia obywatelki II";
			break;
		case '7':
			v3 = "ITAR_VlkBabe_H";
			armorname = "Suknia obywatelki III";
			break;
		case '8':
			v3 = "ITAR_VLK_L";
			armorname = "Strój obywatela I";
			break;
		case '9':
			v3 = "ITAR_VLK_M";
			armorname = "Strój obywatela II";
			break;
		case '10':
			v3 = "ITAR_VLK_H";
			armorname = "Strój obywatela III";
			break;
		case '11':
			v3 = "ITAR_Leather_L";
			armorname = "Skórzany pancerz";
			break;
		case '12':
			v3 = "ITAR_Governor";
			armorname = "Kaftan gubernatora";
			break;
	}
	document.getElementById( 'label2' ).innerHTML = "Kształt głowy: "+v2;
	document.getElementById( 'label3' ).innerHTML = "Ciało: "+currBodyTable[curr_bodytex];
	document.getElementById( 'label4' ).innerHTML = "Twarz: "+currFaceTable[curr_headtex];
	document.getElementById( 'label6' ).innerHTML = "Strój: "+armorname;
	document.getElementById( 'code' ).value = 'instance '+curr_guild+'_'+ curr_id +'_'+curr_name+ '\t(Npc_Default)\n{\n\tname\t= "' +curr_name+ '";\n\tguild\t= GIL_'+curr_guild+';\n\tid\t= '+curr_id+';\n\tvoice\t= '+curr_voice+';\n\tflags\t= '+curr_flags+';\n\tnpctype\t= '+curr_npctype+';\n\t'+curr_att+curr_inv+'\n\tB_SetNpcVisual 	(self, '+v1+', "'+v2+'", '+currFaceTable[curr_headtex]+', '+currBodyTable[curr_bodytex]+', '+v3+');\n\tMdl_SetModelFatness (self, '+document.getElementById("range2").value+');\n};';

	permalink = [
		curr_bodymodel, 
		curr_headmodel, 
		curr_outfit, 
		curr_bodytex, 
		curr_headtex,
		outfit].join('-');
	window.location.hash = permalink;
}
function playSound(path) {

    document.getElementById( 'voice_audio' ).src = path;
   document.getElementById( 'voice_audio' ).play();
}
// event listeners
document.querySelector('#voice_play').addEventListener('click', function(){
  playSound('voices/SVM_'+document.getElementById( 'input_voice' ).value+'_WISEMOVE.mp3');
});
function animate() {
	render();
	renderGif();
	requestAnimationFrame( animate );
}