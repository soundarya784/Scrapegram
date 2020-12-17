$(document).ready(() => {
    $("#a,#b,#c,#d").click((e) => {
        var cur = e.currentTarget.id;
        var data = ["a", "b", "c", "d"];
        data.forEach((item) => {
            $("." + item + "2").css("display", "none");
            $("#" + item).removeClass("active");
        });
        $("#" + cur).addClass("active");

        console.log(cur);
        console.log("." + cur + 2);
        $("." + cur + "2").css("display", "inline");

    });
    $("t1").hover(() => {
        $('#t1').tooltip('show');


        // $('#myTooltip').on('show.bs.tooltip', function () {
        //     // do something…
        //   })
    });

    $("#formdownload").submit(() => {
        $(".thanks").css("visibility", "visible")
    });


    $("#form1").validate({
        rules: {
            account_name: {
                required: true
            },
            s1: {
                required: true,
                number: true,
                min: {
                    param: 1
                },
                max: 50
            }
        },
        messages: {


            account_name: {
                required: "Enter username!"
            },
            s1: {
                required: "Enter number of posts!",
                number: "This value should be a number!",
                min: "Minimum value is 1",
                max: "Maximum value is 50",

            }

        },
        success: function () {
            $("#form1,#form2,#form3,#form4").submit(function () {
                $(".loader,.loadertext").css("visibility", "visible");
            });


        },

        errorClass: "error fail-alert",
        validClass: "valid success-alert"
    });

    $("#form2").validate({
        rules: {
            hashtag: {
                required: true
            },
            s2: {
                required: true,
                number: true,
                min: 1,
                max: 50
            }
        },
        messages: {


            hashtag: {
                required: "Enter Hashtag!"
            },
            s2: {
                required: "Enter number of posts!",
                number: "This value should be a number!",
                min: "Minimium value is 1",
                max: "Maximum value is 50",

            }

        },
        success: function () {
            $("#form1,#form2,#form3,#form4").submit(function () {
                $(".loader,.loadertext").css("visibility", "visible");
            });


        },

        errorClass: "error fail-alert",
        validClass: "valid success-alert"
    });



    $("#form3").validate({
        rules: {
            location: {
                required: true
            },
            s3: {
                required: true,
                number: true,
                min: 1,
                max: 50
            }
        },
        messages: {


            location: {
                required: "Enter Location link!"
            },
            s2: {
                required: "Enter number of posts!",
                number: "This value should be a number!",
                min: "Minimium value is 1",
                max: "Maximum value is 50",

            }

        },
        success: function () {
            $("#form1,#form2,#form3,#form4").submit(function () {
                $(".loader,.loadertext").css("visibility", "visible");
            });


        },

        errorClass: "error fail-alert",
        validClass: "valid success-alert"
    });



    $("#form4").validate({
        rules: {
            url: {
                required: true
            }
            
        },
        messages: {


            hashtag: {
                required: "Enter Post link!"
            }
            

        },
        success: function () {
            $("#form1,#form2,#form3,#form4").submit(function () {
                $(".loader,.loadertext").css("visibility", "visible");
            });


        },

        errorClass: "error fail-alert",
        validClass: "valid success-alert"
    });

});