class Player{
    constructor(charX, charY){
        this.charDirection = 0;
        this.charX = charX;
        this.charY = charY;
        this.speed = 8;
    }

    charMove() {
        let futureStep;
        if (charDirection ==0) {
            futureStep = gameGrid.getCurrValue(charX, (charY + d/2)); 
            if (charY+d/2 < canvasHeight && futureStep == 0) {
                charY += speed;
            }
        }
        if (charDirection ==1) {
            futureStep = gameGrid.getCurrValue((charX + d/2), charY); 
            if (charX+d/2 < canvasWidth && futureStep == 0) {
                charX += speed;
            }
        }
        if (charDirection ==2) {
            futureStep = gameGrid.getCurrValue(charX, (charY - d/2)); 
            if (charY-d/2 > 0 && futureStep == 0) {
                charY -= speed;
            }
        }
        if (charDirection ==3) {
            futureStep = gameGrid.getCurrValue((charX - d/2), charY); 
            if (charX-d/2 > 0 && futureStep == 0) {
                charX -= speed;
            }
        }
        charDragged();
    }

    charDraw(){
        if ((keyIsDown(DOWN_ARROW))) {
            charDirection = 0;
            charMove();
            };
        if ((keyIsDown(RIGHT_ARROW))) {
            charDirection = 1;
            charMove();
            }
        if ((keyIsDown(LEFT_ARROW))) {
            charDirection = 3;
            charMove();
            }
        if ((keyIsDown(UP_ARROW))) {
            charDirection = 2;
            charMove();
            }

        ellipse(this.charX, this.charY, 40);
    }
}