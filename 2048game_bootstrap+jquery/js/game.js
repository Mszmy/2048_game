$(function(){
        //是否产生新元素
        var isNewRndItme = false;
        var gameScore = 0;
        //最高分
        var maxScore = 0;

        if(localStorage.maxScore) {
            maxScore = localStorage.maxScore - 0;
        }else {
            maxScore = 0;
        }


        //游戏初始化
        gameInit();

        //上、下、左、右监听事件
        $('body').keydown(function(e) {
            switch (e.keyCode) {
                case 37:
                    // left
                    console.log('left');
                    isNewRndItme = false;
                    isGameOver();
                    break;
                case 38:
                    // up
                    console.log('up');
                    isNewRndItme = false;
                    move('up');
                    isGameOver();
                    break;
                case 39:
                    // right
                    console.log('right');
                    isNewRndItme = false;
                    move('right');
                    isGameOver();
                    break;
                case 40:
                    // down
                    console.log('down');
                    isNewRndItme = false;
                    move('down');
                    isGameOver();
                    break;
            }
        });


        function refreshGame(){
            var items = $('.gameBody .row .item');
            for(var i = 0; i < items.length; i++) {
                items.eq(i).html('').removeClass('nonEmptyItem').addClass('emptyItem');
            }
            gameScore = 0;
            //分数清零
            $('#gameScore').html(gameScore);
            //随机生成两个新元素
            newRndItem();
            newRndItem();
            //刷新颜色
            refreshColor();
            $('#gameOverModal').modal('hide');
        }


        function getSideItem(currentItem, direction) {
            //当前元素的位置
            var currentItemX = currentItem.attr('x') - 0;
            var currentItemY = currentItem.attr('y') - 0;

            //根据方向获取旁边元素的位置
            switch (direction) {
                case 'left':
                    var sideItemX = currentItemX;
                    var sideItemY = currentItemY - 1;
                    break;
                case 'right':
                    var sideItemX = currentItemX;
                    var sideItemY = currentItemY + 1;
                    break;
                case 'up':
                    var sideItemX = currentItemX - 1;
                    var sideItemY = currentItemY;
                    break;
                case 'down':
                    var sideItemX = currentItemX + 1;
                    var sideItemY = currentItemY;
                    break;
            }
            //旁边元素
            var sideItem = $('.gameBody .row .x' + sideItemX + 'y' + sideItemY);
            return sideItem;
        }


        function itemMove(currentItem, direction) {

            var sideItem = getSideItem(currentItem, direction);

            if(sideItem.length == 0) {//当前元素在最边上
                //不动

            }else if(sideItem.html() == '') { //当前元素不在最后一个且左（右、上、下）侧元素是空元素
                sideItem.html(currentItem.html()).removeClass('emptyItem').addClass('nonEmptyItem');
                currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem');
                itemMove(sideItem, direction);
                isNewRndItme = true;

            }else if(sideItem.html() != currentItem.html()) {//左（右、上、下）侧元素和当前元素内容不同
                //不动

            }else {//左（右、上、下）侧元素和当前元素内容相同
                //向右合并
                sideItem.html((sideItem.html() - 0) * 2);
                currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem');
                gameScore += (sideItem.text() - 0) * 10;
                $('#gameScore').html(gameScore);
                // itemMove(sideItem, direction);
                maxScore = maxScore < gameScore ? gameScore : maxScore;
                $('#maxScore').html(maxScore);
                localStorage.maxScore = maxScore;
                isNewRndItme = true;
                return;
            }
        }


        function move(direction){
            //获取所有非空元素
            var nonEmptyItems = $('.gameBody .row .nonEmptyItem');
            //如果按下的方向是左或上，则正向遍历非空元素
            if(direction == 'left' || direction == 'up') {
                for(var i = 0; i < nonEmptyItems.length; i++) {
                    var currentItem = nonEmptyItems.eq(i);
                    itemMove(currentItem, direction);
                }
            }else if(direction == 'right' || direction == 'down') {//如果按下的方向是右或下，则反向遍历非空元素
                for(var i = nonEmptyItems.length -1; i >= 0; i--) {
                    var currentItem = nonEmptyItems.eq(i);
                    itemMove(currentItem, direction);
                }
            }

            //是否产生新元素
            if(isNewRndItme) {
                newRndItem();
                refreshColor();
            }
        }


        function isGameOver(){
            //获取所有元素
            var items = $('.gameBody .row .item');
            //获取所有非空元素
            var nonEmptyItems = $('.gameBody .row .nonEmptyItem');
            if(items.length == nonEmptyItems.length) {//所有元素的个数 == 所有非空元素的个数  即没有空元素
                //遍历所有非空元素
                for(var i = 0; i < nonEmptyItems.length; i++) {
                    var currentItem = nonEmptyItems.eq(i);
                    if(getSideItem(currentItem, 'up').length != 0 && currentItem.html() == getSideItem(currentItem, 'up').html()) {
                        //上边元素存在 且 当前元素中的内容等于上边元素中的内容
                        return;
                    }else if(getSideItem(currentItem, 'down').length != 0 && currentItem.html() == getSideItem(currentItem, 'down').html()) {
                        //下边元素存在 且 当前元素中的内容等于下边元素中的内容
                        return;
                    }else if(getSideItem(currentItem, 'left').length != 0 && currentItem.html() == getSideItem(currentItem, 'left').html()) {
                        //左边元素存在 且 当前元素中的内容等于左边元素中的内容
                        return;
                    }else if(getSideItem(currentItem, 'right').length != 0 && currentItem.html() == getSideItem(currentItem, 'right').html()) {
                        //右边元素存在 且 当前元素中的内容等于右边元素中的内容
                        return;
                    }
                }
            }else {
                return;
            }
            $('.modal-dialog').css('display','block');
        }


        //游戏初始化
        function gameInit(){
            //初始化分数
            $('#gameScore').html(gameScore);
            //最大分值
            $('#maxScore').html(maxScore);
            //为刷新按钮绑定事件
            $('.refreshBtn').click(refreshGame);
            //随机生成两个新元素
            newRndItem();
            newRndItem();
            //刷新颜色
            refreshColor();
        }

        //随机生成新元素
        function newRndItem(){
            //随机生成新数字
            var newRndArr = [2, 2, 4];
            var newRndNum = newRndArr[getRandom(0, 2)];
            console.log('newRndNum: ' + newRndNum);
            //随机生成新数字的位置
            var emptyItems = $('.gameBody .row .emptyItem');
            var newRndSite = getRandom(0, emptyItems.length - 1);
            emptyItems.eq(newRndSite).html(newRndNum).removeClass('emptyItem').addClass('nonEmptyItem');
        }

        //产生随机数，包括min、max
        function getRandom(min, max){
          return min + Math.floor(Math.random() * (max - min + 1));
        }

        //刷新颜色
        function refreshColor(){
            var items = $('.gameBody .item');
            for(var i = 0; i < items.length; i++) {
                // console.log(items.eq(i).parent().index());
                switch (items.eq(i).html()) {
                    case '':
                        items.eq(i).css('background', '');
                        break;
                    case '2':
                        items.eq(i).css('background', '#eee4da');
                        break;
                    case '4':
                        items.eq(i).css('background', '#ede0c8');
                        break;
                    case '8':
                        items.eq(i).css('background', '#f2b179');
                        break;
                    case '16':
                        items.eq(i).css('background', '#f59563');
                        break;
                    case '32':
                        items.eq(i).css('background', '#f67c5f');
                        break;
                    case '64':
                        items.eq(i).css('background', '#f65e3b');
                        break;
                    case '128':
                        items.eq(i).css('background', '#edcf72');
                        break;
                    case '256':
                        items.eq(i).css('background', '#edcc61');
                        break;
                    case '512':
                        items.eq(i).css('background', '#9c0');
                        break;
                    case '1024':
                        items.eq(i).css('background', '#33b5e5');
                        break;
                    case '2048':
                        items.eq(i).css('background', '#09c');
                        break;
                    case '4096':
                        items.eq(i).css('background', '#a6c');
                        break;
                }
            }
        }
    });
