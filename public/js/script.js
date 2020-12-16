$(document).ready(()=>{
$("#a,#b,#c,#d").click((e)=>{
    var cur = e.currentTarget.id;
    var data = ["a","b","c","d"];
    data.forEach((item)=>{
        $("."+item+"2").css("display","none");
        $("#"+item).removeClass("active");
    });
    $("#"+cur).addClass("active");
    
    console.log(cur);
    console.log("."+cur+2);
    $("."+cur+"2").css("display","inline");

});
$("t1").hover(()=>{
    $('#t1').tooltip('show');


    // $('#myTooltip').on('show.bs.tooltip', function () {
    //     // do something…
    //   })
});


$("#form1").validate({
    rules:{
        account_name:{
            required: true
        },
        s1: {
            required: true,
            number: true,
            min: 1,
            max : 50
        }
    },
    messages:{


        account_name:{
            required: "Enter username!"
        },
        s1: {
            required: "Enter number of posts!",
            number: "This value should be a number!",
            min: "Minimum value is 1",
            max : "Maximum value is 50"
        }

    },
    success : (e)=>{
        $("#form1,#form2,#form3,#form4").submit(function(){
            $(".loader,.loadertext").css("visibility","visible");
          });
        
          $("#formdownload").submit(()=>{
            $(".thanks").css("visibility","visible")
        });
    },
errorClass: "error fail-alert",
validClass: "valid success-alert"
});

});
