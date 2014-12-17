	resize_stuff() = function(){
		//window.innterHeight
		curHeight = window.innerHeight;
		curWidth = window.outerWidth; //innerWidth doesn't change from its inital value on Chrome for android HTC EVO 4g lte
		console.log(curWidth + ' - ' + curHeight)
		console.log("Window Width: " + curWidth + " Window Height: " + curHeight);
		buttonpixheight = curHeight/8;
		buttonfontsize = buttonpixheight/2;
		if (curWidth < 640) { small_divider = 4 } else { small_divider = 3 };
		smallbuttonfont = buttonpixheight/small_divider;
		$(".btn").css("height", buttonpixheight+"px");
		$("input").css("height", buttonpixheight+"px");
		$("input").css("width", "30%");
		$(".btn").css("font-size", buttonfontsize+"px");
		$("input").css("font-size", buttonfontsize+"px");
		$(".stall1, .stall2").css("font-size", smallbuttonfont+"px");
		$("#minus-period, #period, #add-period, .settings-icon").css("font-size", buttonfontsize+"px");
		$("#undo, #period_label").css("font-size", buttonfontsize/2+"px");
		$("#time").css("font-size", buttonfontsize+"px");
	}

	var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

	function start_timer(){
		var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
	}

	function timer()
	{
		if (runtime!="stop"){
			$("#time").css("color","#AADD00");
			count=count-1;
			if (count <= 0){
				if (count == 0){
					//move to next period and reset clock
					$("#add-period").click();
					runtime="stop";
					count=120;
				} else {
				   clearInterval(counter);
					//counter ended, do something here
					return;
				}
			}
			minutes = count/60;
			if (minutes < 1){ minutes = 0 }
			minutes = parseInt(minutes);
			seconds = count%60;
			if (seconds < 10){ seconds = "0"+seconds; }
			time_left = "0"+minutes+":"+seconds;
			$("#time").html(time_left);
		} else {
			$("#time").css("color","#990000");
		}

	  //Do code for showing the number of seconds here
	}
	window.addEventListener("resize", function() {
		resize_stuff();
	}, false);

function manage_fall(period, color, ptvalue) {
	$.ajax({
		type:"post",
		url:"/addpoints/{{ match_id }}/",
		async: true,
		data:"period="+period+"&color="+color+"&pointcode=F&points=0",
		success: function(msg){
			window.location.href="http://www.matsidestats.com/view_match/{{ match_id }}/";
		}
	})
}

function manage_stall_warning(ptvalue) {
	if (ptvalue=="stall1"){
		stall_warn1+=1;
		if (stall_warn1>=2){
			if (stall_warn1 > 3){stall_increment=2} else {stall_increment=1};
			curr_val = $(".wrestler2 input").val();
			if (curr_val==""){curr_val=0};
			new_val = parseInt(curr_val)+stall_increment;
			$(".wrestler2 input").val(new_val);
		}
	} else if (ptvalue=="stall2"){
		stall_warn2+=1;
		if (stall_warn2>=2){
			if (stall_warn2 > 3){stall_increment=2} else {stall_increment=1};
			curr_val = $(".wrestler1 input").val();
			if (curr_val==""){curr_val=0};
			new_val = parseInt(curr_val)+stall_increment;
			$(".wrestler1 input").val(new_val);
		}
	}
}

function manage_ui(ptcode, color){
	// Disable buttons under certain circumstances

	// ========= Take Down ===========
		if (ptcode == "T-green"){
			//self
			$("button[name~='E-green']").attr("disabled", true); 
			$("button[name~='R-green']").attr("disabled", true); 
			$("button[name~='T-green']").attr("disabled", true); 
			$("button[name~='N-green']").attr("disabled", false);
			//opponent
			$("button[name~='T-red']").attr("disabled", true);
			$("button[name~='N-red']").attr("disabled", true);
			$("button[name~='R-red']").attr("disabled", false);
			$("button[name~='E-red']").attr("disabled", false);
		}
		if (ptcode == "T-red"){
			//self
			$("button[name~='E-red']").attr("disabled", true); 
			$("button[name~='R-red']").attr("disabled", true); 
			$("button[name~='T-red']").attr("disabled", true); 
			$("button[name~='N-red']").attr("disabled", false);
			//opponent
			$("button[name~='T-green']").attr("disabled", true);
			$("button[name~='N-green']").attr("disabled", true);
			$("button[name~='R-green']").attr("disabled", false);
			$("button[name~='E-green']").attr("disabled", false);
		}

		// =========== Reversal ================
		if (ptcode == "R-red"){ 
			manage_ui("T-red", "red");
		} else if (ptcode == "R-green"){
			manage_ui("T-green", "green");
		}
		// =========== Escape =================
		if (ptcode == "E-red" || ptcode == "E-green"){
			 $("button").attr("disabled", false);
			 manage_ui_neutral();
		 }

}

function manage_ui_neutral(){
		// ========= Neutral ============
	$("button[name~='R-red']").attr("disabled", true);
	$("button[name~='R-green']").attr("disabled", true);
	$("button[name~='N-red']").attr("disabled", true);
	$("button[name~='N-green']").attr("disabled", true);
	$("button[name~='E-red']").attr("disabled", true);
	$("button[name~='E-green']").attr("disabled", true);
}
	// If T2 then remove r2 of current wreslter == Opponent loses T2 / N2 / N3
	$(document).ready(function(){
		// Guys are netureal
			manage_ui_neutral();

		// if the endmatch link is clicked
		$("#endmatch").click(function(e){
			e.preventDefault();
			$.ajax({
				type: "POST",
				url: "/endmatch/",
				data: "match_id=" + {{ match_id }},
				success: function(result){
					if (result=="success"){
						window.location.href = "/teamview";
					}
				}
			});
		});

		$("#myPeriodChoice").click(function(){
			
		});
			
		$("#time").click(function(){
			if (runtime=="stop"){
				runtime='run';
			} else {
				runtime='stop';
			}
		});

		$('body').on('swipeleft swiperight',function(event){
			    if (event.type == "swiperight") {
				     alert("swipped right side");
				}
				if (event.type == "swipeleft") {
					 alert("swipped left side");
					 event.preventDefault();
				}
		});

		resize_stuff();

		$("#undo").click(function(){
			if (undo){
				$("#undo").css("color", "black");
				undo=0;
			}else{
				$("#undo").css("color", "red");
				undo=1;
			}
		});
		$("#settings-icon").click(function(){

			//add layover and the stuff that goes with it.

		});

		$("button").click(function(){
			var button_action = new Array('fall1', 'fall2', 'stall1','stall2')
			ptvalue = $(this).attr("ptvalue");
			if (button_action.indexOf(ptvalue) >= 0){
				inpt = $(this).parent().find("input")
				period = $("#period").html()
				color = inpt.attr("name");
				switch (ptvalue){
					case "stall1":
						manage_stall_warning(ptvalue);
						break;
					case "stall2":
						manage_stall_warning(ptvalue);
						break;
					case "fall1":
						manage_fall(period, color, ptvalue);
						break;
					case "fall2":
						manage_fall(period, color, ptvalue);
						break;
				}
			} else {
				inpt = $(this).parent().find("input")
				current_value = inpt.val();
				if (current_value==""){current_value=0};
				if (undo){ptvalue*=-1;}
				new_value = parseInt(ptvalue)+parseInt(current_value);
				inpt.val(new_value);
				color = inpt.attr("name");
				pointcode = $(this).html()[0]
				period = $("#period").html()
				var ptname = $(this).attr("name");
				manage_ui(ptname, color);
				$.ajax({
					type:"post",
					url:"/addpoints/{{ match_id }}/",
					async: true,
					data:"period="+period+"&color="+color+"&pointcode="+pointcode+"&points="+ptvalue,
				})
			}
		});


		$("#add-period").click(function(){
			current_val = parseInt($("#period").html());
			new_val = current_val+1;
			$("#period").html(new_val);
		});
		$("#minus-period").click(function(){
			current_val = parseInt($("#period").html());
			new_val = current_val-1;
			$("#period").html(new_val);
		});
	});


