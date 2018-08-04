(function (document, window) {
    function Verify(canvasId, inputId) {
        this.canvasId = canvasId;
        this.inputId = inputId;
        this.result = null;
        this.init();
    }
    Verify.prototype = {
        "init": function () {
            this.getCanvas();
            this.reset();
            this.resetCanvas();
        },
        "resetCanvas": function () {
            var scope = this;
            this.canvas.onclick = function () {
                scope.reset();
            }
        },
        "check": function () {
            var result = parseInt((this.input.value).trim());

            if (result === '' || isNaN(result)) {
                alert("请输入计算结果！");
                this.input.value = "";
                this.reset();
                this.input.focus();
                return false;
            } else if (result === this.result) {
                return true;
            } else {
                this.reset();
                alert("图文验证结果不正确！");
                this.input.value = "";
                this.input.focus();
                return false;
            }
        },
        reset: function () {
            this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawDots();
            var fuhao = this.drawJiaJian();
            this.drawDenghao();
            var a = Math.round(Math.random() * 9);
            var b = Math.round(Math.random() * 9);
            this.cxt.save();
            this.cxt.translate(15, 10);
            this.pickNum(a);
            this.cxt.restore();
            this.cxt.translate(65, 8);
            this.pickNum(b);
            this.cxt.translate(-65, -8);
            switch (fuhao) {
                case 0:
                    this.result = a + b;
                    break;
                case 1:
                    this.result = a - b;
                    break;
                case 2:
                    this.result = a * b;
                    break;
            }
        },
        "getCanvas": function () {
            this.canvas = document.getElementById(this.canvasId);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.canvas.style.cursor = "pointer";

            this.cxt = this.canvas.getContext("2d");
            this.input = document.getElementById(this.inputId);
        },
        "pickColor": function () {
            var color = "rgb(";
            for (var i = 0; i < 3; i++) {
                var a = Math.round(Math.random() * 255);
                if (i < 2) {
                    color += a + ',';
                } else {
                    color += a;
                }
            }
            color += ")";
            return color;
        },
        drawOne: function () {
            this.cxt.beginPath();
            this.cxt.moveTo(0, 4);
            this.cxt.lineWidth = "2";
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.quadraticCurveTo(3, 3, 4, 0);
            this.cxt.quadraticCurveTo(5, 13, 2, 18);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawTwo: function () {
            this.cxt.beginPath();
            this.cxt.moveTo(0, 4);
            this.cxt.lineWidth = "2";
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.bezierCurveTo(8, -4, 12, 10, 0, 17);
            this.cxt.bezierCurveTo(6, 19, 7, 14, 9, 18);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawThree: function () {
            this.cxt.beginPath();
            this.cxt.moveTo(0, 4);
            this.cxt.lineWidth = "2";
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.bezierCurveTo(8, -4, 12, 4, 4, 9);
            this.cxt.bezierCurveTo(12, 12, 8, 22, 0, 14);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawFour: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.save();
            this.cxt.moveTo(4, 0);
            this.cxt.quadraticCurveTo(5, 5, 0, 10);
            this.cxt.lineTo(8, 10);
            this.cxt.restore();
            this.cxt.moveTo(4, 0);
            this.cxt.quadraticCurveTo(6, 9, 4, 18);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawFive: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.save();
            this.cxt.moveTo(0, 0);
            this.cxt.quadraticCurveTo(1, 3, 0, 9);
            this.cxt.bezierCurveTo(10, 4, 10, 18, 0, 16);
            this.cxt.restore();
            this.cxt.moveTo(0, 3);
            this.cxt.lineCap = "round";
            this.cxt.quadraticCurveTo(6, 4, 8, 2);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawSix: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.moveTo(4, 0);
            this.cxt.bezierCurveTo(-10, 30, 30, 20, 1, 12);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawSeven: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.moveTo(0, 4);
            this.cxt.lineTo(0, 0);
            this.cxt.lineTo(10, 0);
            this.cxt.quadraticCurveTo(2, 9, 4, 18);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawEight: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.moveTo(6, 0);
            this.cxt.bezierCurveTo(-10, 8, 20, 15, 6, 18);
            this.cxt.bezierCurveTo(2, 9, 4, 18, 6, 0);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawNine: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.moveTo(6, 6);
            this.cxt.bezierCurveTo(-10, 20, 14, -20, 6, 18);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawZero: function () {
            this.cxt.beginPath();
            this.cxt.strokeStyle = this.pickColor();
            this.cxt.lineWidth = "2";
            this.cxt.moveTo(0, 9);
            this.cxt.bezierCurveTo(10, -15, 10, 25, 0, 9);
            this.cxt.stroke();
            this.cxt.closePath();
        },
        drawJiaJian: function () {
            var num = Math.round(Math.random() * 2);
            switch (num) {
                case 0:
                    this.cxt.beginPath();
                    this.cxt.font = "30px Georgia";
                    this.cxt.fillStyle = this.pickColor();
                    this.cxt.fillText("+", 36, 25);
                    this.cxt.closePath();
                    return 0;
                    break;
                case 1:
                    this.cxt.beginPath();
                    this.cxt.font = "30px Georgia";
                    this.cxt.fillStyle = this.pickColor();
                    this.cxt.fillText("-", 36, 25);
                    this.cxt.closePath();
                    return 1;
                    break;
                case 2:
                    this.cxt.beginPath();
                    this.cxt.font = "30px Georgia";
                    this.cxt.fillStyle = this.pickColor();
                    this.cxt.fillText("×", 36, 25);
                    this.cxt.closePath();
                    return 2;
                    break;
            }
        },
        drawDenghao: function () {
            this.cxt.beginPath();
            this.cxt.font = "30px Georgia";
            this.cxt.fillStyle = this.pickColor();
            this.cxt.fillText("=", 80, 25);
            this.cxt.closePath();
        },
        drawDots: function () {
            var y = 2;
            for (var i = 0; i < 50; i++) {
                var x = 2;
                var randomLen = Math.random() * 32;
                for (var j = 0; j < 10; j++) {
                    x += randomLen;
                    randomLen = Math.random() * 34;
                    y = randomLen;
                    this.cxt.beginPath();
                    this.cxt.fillStyle = this.pickColor();
                    this.cxt.fillRect(x, y, 1, 1);
                    this.cxt.closePath();
                }
            }
        },
        pickNum: function (num) {
            switch (num) {
                case 0:
                    this.drawZero();
                    break;
                case 1:
                    this.drawOne();
                    break;
                case 2:
                    this.drawTwo();
                    break;
                case 3:
                    this.drawThree();
                    break;
                case 4:
                    this.drawFour();
                    break;
                case 5:
                    this.drawFive();
                    break;
                case 6:
                    this.drawSix();
                    break;
                case 7:
                    this.drawSeven();
                    break;
                case 8:
                    this.drawEight();
                    break;
                case 9:
                    this.drawNine();
                    break;
            }
        }
    }
    window.Verify = Verify;
})(document, window);