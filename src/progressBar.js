(function () {
    if (window.progressBar) {
        return;
    }
    let progressConfig = {
        type: "top", //top, circle
        targetClass: "progress",
        textClass: "text",
        value: 100, 
        duration: 1000, //ms
        completeDuration: 500, //ms
        circle: {
            r: 45
        }
    }

    function progressBar(cf) {
        this.config = Object.assign({}, progressConfig, cf);
        this.elem = document.getElementsByClassName(this.config.targetClass)[0];
        this.text = document.getElementsByClassName(this.config.textClass)[0];
        this.type = this.config.type;
        this.value = this.config.value;
        this.duration = this.config.duration;
        this.completeDuration = this.config.completeDuration;

        switch (this.type) {
            case "top":
                this.initTopProgress();

                this.complete = function () {
                    this.setTopProgress();
                }
                break;
            case "circle":
                this.initCircleProgress();

                this.complete = function () {
                    this.setCircleProgress();
                }
                break;
            default:
                break;
        }

        // Setup the animation loop.
        function animate(time) {
            requestAnimationFrame(animate);
            TWEEN.update(time);
        }
        requestAnimationFrame(animate);
    }
    progressBar.prototype = {
        setTopProgress: function (end) {
            let elem = this.elem;
            this.topProgress.to({
                    x: end || this.value
                }, end ? this.duration : this.completeDuration)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate(function () {
                    elem.setAttribute("style", "width: " + this.x + "%");
                })
                .start();
        },
        setCircleProgress: function (end) {
            let elem = this.elem;
            let length = this.length;
            let text = this.text;
            this.circleProgress.to({
                    x: end || this.value
                }, end ? this.duration : this.completeDuration)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate(function () {
                    elem.style.strokeDashoffset = length - length * this.x / 100;
                    text.textContent = Math.floor(this.x) + '%';
                })
                .start();
        },
        initTopProgress: function () {
            this.startPos = {
                x: 0
            };

            this.topProgress = new TWEEN.Tween(this.startPos);
            this.setTopProgress(80);
        },
        initCircleProgress: function () {
            this.radius = this.config.circle.r;
            this.length = 2 * Math.PI * this.radius;
            this.elem.style.strokeDasharray = this.length;
            this.elem.style.strokeDashoffset = this.length;
            
            this.startPos = {
                x: 0
            };

            this.circleProgress =  new TWEEN.Tween(this.startPos);
            this.setCircleProgress(80);
        }
    };
    window.progressBar = progressBar;
})()