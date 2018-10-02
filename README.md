# DM1
离散数学中命题逻辑一些功能的编程实现
# 主要功能
1. 对输入的任意合式公式,判断它是否合法
2. 如果合法,输出它的真值表与主范式,不合法则输出它不合法
3. 输入两个合式公式,判断它们是否等价
4. 下面是几个例子
![例1.png](https://upload-images.jianshu.io/upload_images/5962281-6907812b4c27acb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![例2.png](https://upload-images.jianshu.io/upload_images/5962281-49c8b968e5f9c220.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![例3.png](https://upload-images.jianshu.io/upload_images/5962281-84271170bac8da86.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![例4.png](https://upload-images.jianshu.io/upload_images/5962281-470df8195154fcca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 目录结构
应用根目录
||------css-------------------------------------------样式表目录

||---------||---common.css-----------------------公共样式表文件

||------js---------------------------------------------JavaScript文件存放目录

||---------||---common.js-------------------------公共JavaScript文件

||---------||---equivalence.js--------------------判断两公式逻辑等价的文件

||---------||---Tools.js-----------------------------工具类文件

||---------||---truthTable.js-----------------------输出真值表与主范式的文件

||------equivalence.html------------------------判断逻辑等价的界面文件

||------truthTable.html---------------------------输出真值表与主范式的界面文件

# 使用说明
**step1.** 直接将应用根目录中的equivalence.html文件或者truthTable.html文件拖入浏览器即可使用,本应用只在chrome和ie11上测试过,经测试可以正常使用;

**step2.** '!'代表非联结词,'&'代表合取联结词,'|'代表析取联结词,'>'代表条件联结词,'~'代表双条件联结词,命题变元可以用26个大写英文字母表示;

**step3.** 如果在判断逻辑等价的界面中输入T或F,系统会认为它是重言式或者矛盾式。如下图所示:
![重言式.png](https://upload-images.jianshu.io/upload_images/5962281-5d163933ead93538.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![矛盾式.png](https://upload-images.jianshu.io/upload_images/5962281-e1adc2d4339b5e70.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
