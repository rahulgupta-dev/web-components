function generateBranding () {
	$.getJSON('http://localhost:3000/brandings', function (json) {
		const mainBrandingColor = json && json.primary_branding_color ? json.primary_branding_color : '#5392FF'
		const foregroundColor = json && json.primary_foreground_color ? json.primary_foreground_color : '#FFFFFF'

		const mainBrandingShadeColor = mixColor('#1f2126', mainBrandingColor, 15)
		const mainBrandingTintColor = mixColor('#ffffff', mainBrandingColor, 15)
		const mainBrandingLighterColor = mixColor('#ffffff', mainBrandingColor, 30)
		const opacityBrandingColor = convertHexToRgb(mainBrandingColor, 0.1)

		var styles = `
			.mx-branding-background-light {
				background-color: ${opacityBrandingColor};
			}			
			.mx-branding-background{
				background-color: ${mainBrandingColor};
			}
			.mx-branding-border{
				border-color: ${mainBrandingColor}
			}
			.mx-branding-text, .mx-branding-text-action{
				color: ${mainBrandingColor}
			}
			
			.mx-branding-background.important{
				background-color: ${mainBrandingColor}!important;
			}
			
			.mx-branding-border.important{
				border-color: ${mainBrandingColor}!important;
			}
			.mx-branding-text.important{
				color: ${mainBrandingColor}!important;
			}
			.mx-branding-background-action:hover {
				background-color: ${mainBrandingTintColor};
			}
			
			.mx-branding-border-action:active, 
			.mx-branding-border-action:focus {
				border-color: ${mainBrandingShadeColor};
			}
			
			.mx-branding-border-action:hover {
				border-color: ${mainBrandingTintColor};
			}
			
			.mx-branding-text-action:active, 
			.mx-branding-text-action:focus {
				color: ${mainBrandingShadeColor};
			}
			
			.mx-branding-text-action:hover {
				color: ${mainBrandingTintColor};
			}
			
			.mx-branding-text-hover:hover,
			.mx-branding-text-hover:focus{
				color: ${mainBrandingColor}
			}
			
			.mx-branding-text-hover.important:hover {
				color: ${mainBrandingColor}!important
			}
			
						
			.mx-login-page .mx-sidebar {
				background: ${mainBrandingLighterColor};
			    background: -moz-linear-gradient(top, ${mainBrandingLighterColor} 0%, ${mainBrandingColor} 100%);
			    background: -webkit-linear-gradient(top, ${mainBrandingLighterColor} 0%, ${mainBrandingColor} 100%);
			    background: linear-gradient(to bottom, ${mainBrandingLighterColor} 0%, ${mainBrandingColor} 100%);
			    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='${mainBrandingLighterColor}', endColorstr='${mainBrandingColor}',GradientType=0 );
			}
			a {	color: ${mainBrandingColor}; }
			a:hover { color: ${mainBrandingShadeColor}; }
			a:visited { color:${mainBrandingColor}; }
			
			.main-page .mx-page-sidebar .list-group .list-group-item.active,
			.main-page .mx-page-sidebar .list-group .list-group-item:hover,
			.modal-header {
				color: ${mainBrandingColor} !important;
			}
			.main-page .mx-page-sidebar .list-group .list-group-item:hover .svg-icons svg.icon,
			.main-page .mx-page-sidebar .list-group .list-group-item.active .svg-icons svg.icon,
			.contact-icon.enabled {
				fill: ${mainBrandingColor} !important;	
			}
			
			.main-page .mx-page-sidebar .list-group .list-group-item.active:before,
			.main-page .mx-page-sidebar .list-group .list-group-item:hover:before,
			.mx-tabs .nav-tabs .nav-link.active:before,
			.bootstrap-datetimepicker-widget table td.active span,
			.bootstrap-datetimepicker-widget table td.ui-active:not(.active) span:before {
    			background: ${mainBrandingColor};
    		}
			
			.form-group input[type="text"]:focus, .form-group input[type="password"]:focus, .form-group input[type="search"]:focus, .form-group input[type="search"]:focus, .form-group textarea:focus, .form-group select:focus {
				border-color: ${mainBrandingColor};
			}
			.main-page .mx-page-content header nav.nav .nav-link.active {
			    border: 1px solid ${mainBrandingColor};
			    color: ${mainBrandingColor};
			}
			
			.filter ul li.selected {
			    border-left: 5px solid ${mainBrandingColor} !important;
			}		
			
			.btn-primary {
				color: ${foregroundColor};
    			background-color: ${mainBrandingColor};
    			border-color: ${mainBrandingColor};
			}
			.btn-primary:not(:disabled):not(.disabled):hover,
			.btn-primary:not(:disabled):not(.disabled):focus,
			.btn-primary:not(:disabled):not(.disabled):visited,
			.btn-primary:not(:disabled):not(.disabled).active, 
			.btn-primary:not(:disabled):not(.disabled):active, 
			.show>.btn-primary.dropdown-toggle  {
				color: ${foregroundColor};
    			background-color: ${mainBrandingShadeColor};
    			border-color: ${mainBrandingShadeColor};
			}
			.navbar ul li.active, .navbar ul li:hover {
				color: ${mainBrandingColor};
			}
			
			.pagination .page-item .page-link {
				color: ${mainBrandingColor};
			}  
			.pagination .page-item.active a  {
				color: ${foregroundColor};
				background-color: ${mainBrandingColor};
			}
			.pagination .page-item:hover:not(.active):not(.disabled) a {
				color: ${mainBrandingShadeColor};
				background-color: transparent;
			}
			.spinner:before { border-top-color: ${mainBrandingColor}; }
		`
		var head = document.head ? document.head : document.getElementsByTagName('head')[0]
		var style = document.createElement('style')
		style.id = 'branding-css'
		style.type = 'text/css'
		if (style.styleSheet) {
			style.styleSheet.cssText = styles
		} else {
			style.appendChild(document.createTextNode(styles))
		}

		head.appendChild(style)
		//document.getElementById("branding-spinner").style.display = 'none';
	})
}

function convertHexToRgb (hex, alpha) {
	let hexVal = hex.substr(1)

	if (hexVal === 3) {
		hexVal = `${hexVal[0]}${hexVal[0]}${hexVal[1]}${hexVal[1]}${hexVal[2]}${hexVal[2]}`
	}
	const fullHexVal = `0x${hexVal}`
	const r = (fullHexVal & 0xFF0000) >> 16
	const g = (fullHexVal & 0x00FF00) >> 8
	const b = fullHexVal & 0x0000FF

	let rgbVal = `rgba(${r}, ${g}, ${b}`
	if (alpha) {
		rgbVal += `, ${alpha}`
	}
	rgbVal += ')'
	return rgbVal
}

function mixColor (color_1, color_2, weight) {
	color_1 = indentShortHand(color_1)
	color_2 = indentShortHand(color_2)
	weight = (typeof (weight) !== 'undefined') ? weight : 50 // set the weight to 50%, if that argument is omitted
	let color = "#"
	for (let i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
		let v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
			v2 = h2d(color_2.substr(i, 2)),

			// combine the current pairs from each source color, according to the specified weight
			val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)))

		while (val.length < 2) { val = '0' + val } // prepend a '0' if val results in a single digit

		color += val // concatenate val to our new color string
	}

	return color // PROFIT!
}

function d2h (d) { return d.toString(16) }  // convert a decimal value to hex
function h2d (h) { return parseInt(h, 16) } // convert a hex value to decimal
function indentShortHand (color) {
	let string = '', arr
	if (color.length === 7) {
		return color.slice(1)
	} else {
		arr = color.slice(1, 4).match(/[0-9a-fA-F]/g)
		if (arr.length) {
			string = arr.map(a => a + '' + a).join('')
		}
		return string || color
	}
}
window.addEventListener('load', generateBranding)