// VALIDATION CODES
jQuery.validator.addMethod("email", 
    function(value, element) {
        return this.optional(element) || /^[+\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/i.test(value);
    },"Please enter a valid email address"
);

jQuery.validator.addMethod("letters_space", function(value, element) {
  return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
}, "Letters and space only");

jQuery.validator.addMethod("stateUS", function (state, element) {
    return this.optional(element) || state.match(/^(A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[ANU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/);
}, "Please specify a valid state");

var regExs = [];
for (const validationID in scriptData.jvgf_regexs) {
  	regExs[validationID] 	= new RegExp(scriptData.jvgf_regexs[validationID].regex,'i');
  	errorMsg  	= scriptData.jvgf_regexs[validationID].error_mg;
  	jQuery.validator.addMethod("RegEx-"+validationID, function(value, element) {
	  return this.optional(element) || regExs[validationID].test(value);
	}, errorMsg );
}

jQuery.extend(jQuery.validator.messages,scriptData.jvgf_default_error_msgs);

function jvgf_initialize(){
	jQuery("form[id^='gform_']").each(function(){
		
		jQuery(this).addClass(scriptData.jvgf_default_settings.jvgf_invalid_field_design);
		jQuery(this).addClass(scriptData.jvgf_default_settings.jvgf_show_label_error);
		jQuery('.wpcf7-file').attr('accept','');

		jQuery(this).validate({ 
			ignore: ".input-text.qty, :hidden input, :hidden textarea, :hidden select", // FOR WOOCOMMERCE GRAVITY FORM ADD ON
			onfocusout: function(element) { // ADD VALIDATION ON BLUR
		        this.element(element);  
		    },
		    invalidHandler:  function(event, validator) {
		    	gform_id = jQuery(this).find('input[name="gform_submit"]').val();
		    	window["gf_submitting_"+gform_id] = false;
		    	jQuery('.gform_ajax_spinner').addClass('hideLoading');		    	
		    },
		    errorPlacement: function(error, element) {
	            if (element.is(':radio')){
	            	error.insertAfter(jQuery(element).parent().parent());
	            } else {
	            	error.insertAfter(element);
	            }
         	}
		 });
	});

	jQuery('.gform_button').click(function(e){ 
		$jvcfpValidation 	=	jQuery(this).parents('form');		
		if (jQuery($jvcfpValidation).valid()){
			jQuery('.gform_ajax_spinner').removeClass('hideLoading');
		}
	});
	
	jQuery('.gform_previous_button').click(function(e){
		jQuery("label.error").hide();
		$jvcfpValidation 	=	jQuery(this).parents('form');		
		$jvcfpValidation.validate().cancelSubmit = true;		
		onClickEvent 		= jQuery(this).attr('onclick'); // READ GRAVITY JS CODE
		eval(onClickEvent); // CALL IT
	});

	jQuery('.gform_save_link').click(function(e){
		jQuery("label.error").hide();
		$jvcfpValidation 	=	jQuery(this).parents('form');		
		$jvcfpValidation.validate().cancelSubmit = true;		
		formID = jQuery($jvcfpValidation).find('input[name="gform_submit"]').val();
		jQuery("#gform_save_"+formID).val(1);
		jQuery("#gform_"+formID).trigger("submit", [true]);		
	});

	jQuery('[class*="JVmin-"]').each(function(){ // Min
		allClasser = jQuery(this).attr('class');
		processingClass 		= allClasser.match(/JVmin-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).attr('min',processingClassSplit[1]);
	});
	
	jQuery('[class*="JVmax-"]').each(function(){ // Max
		allClasser = jQuery(this).attr('class');
		processingClass 		= allClasser.match(/JVmax-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).attr('max',processingClassSplit[1]);
	});
	
	jQuery('[class*="JVminlength-"]').each(function(){ // Minlength
		allClasser = jQuery(this).attr('class');
		processingClass 		= allClasser.match(/JVminlength-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).rules( "add", {minlength: processingClassSplit[1]});
	});
	
	jQuery('[class*="JVmaxlength-"]').each(function(){ // Maxlength
		allClasser = jQuery(this).attr('class');
		processingClass 			= allClasser.match(/JVmaxlength-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).rules( "add", {maxlength: processingClassSplit[1]});
	});
	
	jQuery('[class*="JVrangelength-"]').each(function(){ // rangelength
		allClasser = jQuery(this).attr('class');
		processingClass 			= allClasser.match(/JVrangelength-[0-9]+-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).rules( "add", {rangelength: [processingClassSplit[1],processingClassSplit[2] ]});
	});
	
	jQuery('[class*="JVrange-"]').each(function(){ // range
		allClasser = jQuery(this).attr('class');
		processingClass 			= allClasser.match(/JVrange-[0-9]+-[0-9]+/);
		var processingClassSplit	= processingClass.toString().split("-");
		jQuery(this).rules( "add", {range: [processingClassSplit[1],processingClassSplit[2] ]});
	});
	
	jQuery('[class*="JVequalTo-"]').each(function(){ // range
		allClasser = jQuery(this).attr('class');
		processingClass 			= allClasser.match(/JVequalTo-[a-zA-Z0-9-_]+/);
		var processingClassSplit	= processingClass.toString().split("To-");
		jQuery(this).rules( "add", {equalTo: "[name="+processingClassSplit[1]+"]" });
	});
	
	jQuery('[class*="JVextension-"]').each(function(){ // range
		allClasser = jQuery(this).attr('class');
		processingClass 				= allClasser.match(/JVextension-[a-zA-Z0-9-_]+/);
		var processingClassSplit		= processingClass.toString().split("extension-");
		var processingExtensionSplit	= processingClassSplit[1].toString().split("_");
		var extnesions 					= processingExtensionSplit.join('|');
		jQuery(this).rules( "add", {extension: extnesions });		
	});
		
	jQuery('[class*="JVrequireGroup-"]').each(function(){ // range
		allClasser = jQuery(this).attr('class');
		processingClass 				= allClasser.match(/JVrequireGroup-[a-zA-Z0-9-_]+/);
		var processingClassSplit		= processingClass.toString().split("requireGroup-");
		var processingCountClassSplit	= processingClassSplit[1].toString().split("_");
		jQuery(this).addClass(processingCountClassSplit[1]);
		jQuery(this).rules( "add", {require_from_group: [processingCountClassSplit[0], "."+processingCountClassSplit[1]] });		
	});

	jQuery('input.checkUsername').each(function(){
		jQuery(this).rules( "add", {
			"remote": {
				'url'  : scriptData.jvgf_ajax_url,
				'type' : "post",
				'data' : {
					"method":"checkUsername",
					"fieldname" : jQuery(this).attr('name')
				}
			}
		});
	});

	jQuery('[class*="CCode-"]').each(function(){ // NEW MULTI CUSTOM CODE
		allClasser = jQuery(this).attr('class');
		processingClass 				= allClasser.match(/CCode-[0-9]+/);
		var processingClassSplit		= processingClass.toString().split("-");
		CustomValidatonID 				= processingClassSplit[1];

		jQuery(this).rules( "add", {
			"remote": {
				'url'  : scriptData.jvgf_ajax_url,
				'type' : "post",
				'data' : {
					"method"				: "customCode",
					"fieldname" 			: jQuery(this).attr('name'),
					"custom_validation_id"	: CustomValidatonID
				}
			}
		});
	});

	// EMAIL VERIFICATION
	jQuery('input.emailVerify').each(function(){		
		elementName  	= jQuery(this).attr('name');
		elementSize		= jQuery(this).outerWidth();
		saveButton 		= '<span style="width:'+elementSize+'px;" class="verification_code_holder"><input type="text" name="email-verification-code" data-for="'+elementName+'" class="verifyEmailCode required" value="" placeholder="'+scriptData.jvgf_default_settings.jvgf_verify_code_field_placeholder+'" /><input type="button" class="jvgf_verify_email_btn" value="Send Code" data-for="'+elementName+'" id="jvgf_verify_email_btn" style="display:none;" /></span>';
		jQuery(saveButton).insertAfter(this);

		
		jQuery('.verifyEmailCode').rules( "add", {
			'required':true,
			"remote": {
				'url'  : scriptData.jvgf_ajax_url,
				'type' : "post",
				'data' : {
					"method":"verifyEmailCode",
					"fieldname" : "email-verification-code",
					"email" 	: function (){return jQuery('input[name='+elementName+']').val();}

				}
			}
		});
		jQuery('.jvgf_verify_email_btn').show();
	});

	jQuery('input.jvgf_verify_email_btn').click(function(){
			 fieldname = jQuery(this).attr('data-for');
			 if (jQuery("input[name="+fieldname+"]").valid() == true){
				 jQuery.ajax({
				 	url  : scriptData.jvgf_ajax_url,
				 	context:this,
				 	type : "post",
					data : {
								"method"			: "sendVerificationCode",
								"email" 			: jQuery("input[name="+fieldname+"]").val()
							 },
				    beforeSend: function() {
				        jQuery(this).removeClass('valid');
				        jQuery(this).attr('value','Sending..');			        
				    },
				    success: function(data) {
				      	jQuery(this).removeClass('valid');
				      	jQuery(this).attr('value','Resend Code');			      	
					},
				    error: function() {
				    	jQuery(this).removeClass('valid');
				    	jQuery(this).attr('value','Error !');			    	
				    }
				  });
			} else {
				jQuery("input[name="+fieldname+"]").focus();
			}
	});
}

jQuery(document).on('gform_post_render', function(event, form_id, current_page){ // GRAVITY FORMS FIXES
	jvgf_initialize();		
});