## Blockchain-HW2

#### 项目分析

主要分为以下功能模块

1. 实现积分的领取（浙大币）
2. 实现创建提案的功能
3. 实现投票的功能
    - 限制用户投票次数
    - 规定时间内才可投票
4. 时间到达，检查提案是否通过并给予通过项目的创建者贡献奖励



如何实现

1. 通过ERC20发放1000货币（挪用彩票demo的功能实现代码）
2. 输入结束时间和提案名称，依据创建提案的时间从0开始给提案排序，并扣除3个浙大币
3. 输入序号投票支持或者反对，记录当前投票人的地址并将投票事件上链，投票一次花费1个浙大币，只有满足以下条件才能成功投票
    - 投票序号存在
    - 项目未截止
    - 账户未投票超过三次
    - 账户超过一个浙大币
4. 通过点击检查按钮来检验提案是否通过，通过的予以该提案赞成票等额的浙大币+创建提案花费的3个浙大币奖励



#### 如何运行

1. 打开并运行ganache，将私钥复制进ZJU-blockchain-course-2022-main\contracts\hardhat.config.ts文件下

2. 在ZJU-blockchain-course-2022-main\contracts文件夹打开终端输入npx hardhat run scripts/deploy.ts --network ganache运行，将得到合约部署地址复制到ZJU-blockchain-course-2022-main\frontend\src\utils\contract-addresses.json文件下

    ![image-20221110055327483](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055327483.png)

3. 在ZJU-blockchain-course-2022-main\frontend文件夹下打开终端，输入npm start

4. 打开localhost:3000网页

5. 用小狐狸导入ZJU-blockchain-course-2022-main\frontend\src\utils\contract-addresses.json文件中的账户私钥

    ![image-20221110055458004](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055458004.png)

    ![image-20221110055532695](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055532695.png)

6. 若有连接账户则连接账户，若无则直接领取空投

    ![image-20221110055601835](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055601835.png)

    ![image-20221110055629619](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055629619.png)

7. 尝试对不存在的提案投票，提示序号不存在

    ![image-20221110055738296](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055738296.png)

    ![image-20221110055819804](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055819804.png)

8. 以当前时间作为结束时间投票，创建账户并且尝试投票，提示合约以失效，刷新页面后浙大币数量变成997，总提案数量变成1

    ![image-20221110055859071](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110055859071.png)

    ![image-20221110060017980](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060017980.png)

    ![image-20221110060037351](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060037351.png)

    ![image-20221110060224684](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060224684.png)

9. 创建合约并投一次赞成和三次反对，在第三次反对的时候提示投票超出上限，刷新后浙大币变成991个，总提案数变成2

    ![image-20221110060345802](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060345802.png)

    第三次投票

    ![image-20221110060408561](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060408561.png)

    ![image-20221110060456209](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060456209.png)

10. 创建投票，货币变成988，投一次赞成货币变成987，结束后点击检查，货币变成991，提案通过并返回货币

    ![image-20221110060650768](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060650768.png)

    ![image-20221110060722614](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060722614.png)

    ![image-20221110060808088](C:\Users\zhang\AppData\Roaming\Typora\typora-user-images\image-20221110060808088.png)

