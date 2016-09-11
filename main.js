$(document).ready(function(){
	enableSelectDropDown();
});

function enableSelectDropDown(){
	addSelectToDiv();
	enable_dropdown_appear();
	enable_input_change();
	enable_input_key_press();
	enable_dropdown_disappear();

	
}

function addSelectToDiv(){
	$('select').each(function(){
		var $div_el = "<div style='display:inlne-block' class='select_input'><input type='text' name=''><ul class='select_input_master'></ul></div>";
		$(this).after($div_el);
	});
	$('.select_input').each(function(){
		var $sel_el = $(this).prev('select');
		$sel_el.css('display','none');
		$(this).append($sel_el);
	});
}

function setFocusOn_($li_el){
	$parent_ul = $li_el.parent();
	$parent_ul.find('li').each(function(){
		$(this).removeClass('select_input_li_focused');
	});
	$li_el.addClass('select_input_li_focused');
}

function enable_input_key_press(){
	var $select_input_text = $('.select_input>input[type="text"]');
	$select_input_text.keypress(function(e){
		if(e.keyCode==38 || e.keyCode==40){
			if($(this).parent().find('.select_input_li_focused').length<=0){
			appearDropdown($(this));
			setFocusOn_($(this).parent().find('.select_input_master li:first-child'));
		}else{
			var $li_el = $(this).parent().find('.select_input_li_focused');
			if(e.keyCode==38){
				setFocusOn_($li_el.prev('li'));
			}else if(e.keyCode==40){
				setFocusOn_($li_el.next('li'));
			}
			
		}

		}

		if(e.keyCode==13){
			var $selected_li = $(this).parent().find('.select_input_li_focused');
			if($selected_li.length>0){
				var index_num = $selected_li.data('index_num');
				$selected_li.parent().parent().find('select').prop('selectedIndex',index_num);
				$(this).val($selected_li.text());
				disappearDropdown($(this));
			}
		}
	});
}


function enable_dropdown_appear(){
	var $select_input_text = $('.select_input>input[type="text"]');
	$select_input_text.focus(function(){
		appearDropdown($(this));
	});
	$select_input_text.click(function(){
		appearDropdown($(this));
	});
}



function enable_input_change(){
	var $select_input_text = $('.select_input>input[type="text"]');
	$select_input_text.on('input',function(){
		appearDropdown($(this));
		var $val = $(this).val();
		$val = $.trim($val);

		var $select_input_dropdrown_ul_master = $(this).parent().find('.select_input_master');
		var $select_input_dropdrown_ul_slave = $(this).parent().find('select');
		var $select_input_dropdrown_li = $select_input_dropdrown_ul_slave.find('option').clone();

		$select_input_dropdrown_li = convertOptionElsToListEls($select_input_dropdrown_li);

		
		if($val != ""){			
			var filtered_lists = $select_input_dropdrown_li.filter(function(index){
					return $(this).text().toLowerCase().indexOf($val.toLowerCase())!=-1;
				});
			$select_input_dropdrown_ul_master.html(filtered_lists);
			enable_list_select($select_input_dropdrown_ul_master);
		}else{
			$select_input_dropdrown_ul_master.html($select_input_dropdrown_li);
			enable_list_select($select_input_dropdrown_ul_master);
		}
		

	});
}

function enable_list_select($ul_el){
	var $select_input_li = $ul_el.find('li');
	$select_input_li.each(function(){
		$(this).click(function(){
			var index_num = $(this).data('index_num');
			var $input_el = $(this).parent().parent().find("input[type='text']");
			$input_el.val($(this).text());
			disappearDropdown($input_el);
			
			$(this).parent().parent().find('select').prop('selectedIndex',index_num);
		});

		$(this).hover(function(){
			setFocusOn_($(this));
		});
	})

}

function enable_dropdown_disappear(){
	var $ul_el = $('.select_input_master');
	var $select_input = $('.select_input');
	$select_input.on('mouseleave', function(){
		var $input_el = $(this).find("input[type='text']");
		disappearDropdown($input_el);
	});


	$ul_el.each(function(){
		$(this).on('mouseleave', function(){
			disappearDropdown($(this).parent().find("input[type='text']"));
		});
	
	});
	
}



function appearDropdown($input_el){
	$input_el.css({'border-bottom':'none'});
	var $select_input_dropdrown_ul_master = $input_el.parent().find('.select_input_master');
	var $select_input_dropdrown_ul_slave = $input_el.parent().find('select');
	var $select_input_dropdrown_li = $select_input_dropdrown_ul_slave.find('option').clone();

	

	$select_input_dropdrown_li = convertOptionElsToListEls($select_input_dropdrown_li);
	$select_input_dropdrown_ul_master.html($select_input_dropdrown_li);

	$select_input_dropdrown_ul_master.fadeIn(200);
	enable_list_select($select_input_dropdrown_ul_master);
}

function disappearDropdown($input_el){
	$input_el.parent().find('.select_input_master').fadeOut(300);
	$input_el.css({'border-bottom':'1px solid rgba(23,34,65,0.3)'});
}

function convertOptionElsToListEls($optionEls){
	var returnVal = '';
	$optionEls.each(function(){
		var index_num = $optionEls.index($(this));
		returnVal+="<li data-index_num='"+index_num+"'>"+$(this).html().toString()+"</li>"
	});
	return $(returnVal);
}

