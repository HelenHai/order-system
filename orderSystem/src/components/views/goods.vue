<template>
  <div class="order">

    <el-row  >
      <el-col :span='7' class="pos-system" id="order-list">
        <el-tabs>
          <el-tab-pane label="点餐">
            <el-table :data="tableData" border style="width:100%;">
              <el-table-column prop="goodsName" label="商品" ></el-table-column>
              <el-table-column prop="count" label="份" width="50"></el-table-column>
              <el-table-column prop="price" label="单价" width="70"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template scope="scope">
                  <el-button type="text" size="small" @click="delGoods(scope.row)">删除</el-button>
                  <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="挂单">挂单</el-tab-pane>
          <el-tab-pane label="外卖">外卖</el-tab-pane>
        </el-tabs>
        <div class="total"><br><span>---------数量: {{totalCount}} 件--------</span><span>总计: {{totalMoney}} 元---------</span></div>
        <div id="pay-button">
          <el-button type="warning">挂单</el-button>
          <el-button type="danger" @click="delAllGoods()">删除</el-button>
          <el-button type="success" @click="submit()">结账</el-button>
        </div>
      </el-col>
      
      <!--商品展示-->
      <el-col :span="17" class="goods-display" id="display-list" >
        <!-- 高频商品  -->
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list" >
            <ul><li v-for="goods in oftenGoods" :key="goods.id" @click="addOrderList(goods)">
              <span>{{goods.goodsName}}</span>
              <span class="o-price">￥{{goods.price}}</span>
            </li></ul>
          </div>
        </div> 

        <!-- 商品分类 -->
        <div class="goods-type">
          <el-tabs>
              <el-tab-pane label="汉堡">
                 <ul class="cookList"><li v-for="goods in type0Food" :key="goods.id" @click="addOrderList(goods)">
                  <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>   
                </li></ul>
              </el-tab-pane>
              <el-tab-pane label="小食">
                <ul class="cookList"><li v-for="goods in type1Food" :key="goods.id" @click="addOrderList(goods)">
                  <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>   
                </li></ul>
              </el-tab-pane>
              <el-tab-pane label="饮料">
                <ul class="cookList"><li v-for="goods in type2Food" :key="goods.id" @click="addOrderList(goods)">
                  <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>   
                </li></ul>
              </el-tab-pane>
              <el-tab-pane label="套餐">
                <ul class="cookList"><li v-for="goods in type3Food" :key="goods.id" @click="addOrderList(goods)">
                  <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>   
                </li></ul>
              </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'goods',
  mounted(){
    var orderHeight=document.body.clientHeight;
    document.getElementById("order-list").style.height=orderHeight+'px';
    document.getElementById("display-list").style.height=orderHeight+'px';
  },
  created(){
    //常用商品
    axios.get('http://jspang.com/DemoApi/oftenGoods.php')
    .then(response=>{
      // console.log(response)
      this.oftenGoods=response.data
    })
    .catch(error=>{
    })
    
    //商品展示
    axios.get('http://jspang.com/DemoApi/typeGoods.php')
    .then(response=>{
      this.type0Food=response.data[0]
      this.type1Food=response.data[1]
      this.type2Food=response.data[2]
      this.type3Food=response.data[3]
    })
    .catch(error=>{
      alert('抱歉...您访问的数据跑到外星去了')
    })
    
  },
  data(){
    return{
      tableData:[],
      oftenGoods:[],
      type0Food:[],
      type1Food:[],
      type2Food:[],
      type3Food:[],
      totalMoney:0,
      totalCount:0
    }
  },
  methods:{
    /**
     * 添加商品至购物车
     */
    addOrderList(goods){
      let isExist=false
      //判断是在购物清单当中，如果不在添加至购物清单中，否则直接添加商品数量
      for(let i=0;i<this.tableData.length;i++){ //判断是在购物清单当中，如果不在添加至购物清单中，否则直接添加商品数量
        if(this.tableData[i].goodsId==goods.goodsId) isExist=true
      }
      if(isExist){
        let arr = this.tableData.filter(o=>o.goodsId==goods.goodsId);
        arr[0].count++
      }
      else{
        let newGoods = {goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1}
        this.tableData.push(newGoods)
      }      
      this.getAllMoney()
    },

    /**
     * 计算账单公用方法
     */
    getAllMoney(){
      this.totalCount=0
      this.totalMoney=0
      if(this.tableData){
        this.tableData.forEach((element) => {
          this.totalCount+=element.count;
          this.totalMoney=this.totalMoney+(element.price*element.count)
      })
      }
     
    },
    /**
     * 从购物车删除商品
     */
    delGoods(goods){
      this.tableData=this.tableData.filter(o=>o.goodsId!=goods.goodsId)
      this.getAllMoney()
    },
    /**
     * 删除所有商品
     */
    delAllGoods(){
      this.tableData=[]
      this.totalCount=0
      this.totalMoney=0
    },
    /**
     * 结账
     */
    submit(){
      if(this.tableData!=0){
        setTimeout(()=>{
          this.tableData=[]
          this.totalCount=0
          this.totalMoney=0
        },800)
        this.$message.success('结账成功！')
      }
      else this.$message.error('订单列表不能为空！')
     
    }

  }
}
</script>

<style scoped>
.order{
  height: 100%; width:100%;
}
.pos-system{
  height: 100%;
  background-color: #e8e8e8;
}
#pay-button{
  margin:70px;
}
.goods-display{
  height: 100%;  
  background: #EFF2F7;
}
 .title{
  height: 20px;
  border-bottom:1px solid #D3DCE6;
  background-color: #F9FAFC;
  padding:10px;
}
.often-goods-list ul li{
  list-style: none;
  float:left;
  border:1px solid #E5E9F2;
  padding:10px;
  margin:10px;
  background-color:#fff;
}
.o-price{
  color:#58B7FF; 
}
.goods-type{
  clear: both;
  
}
.cookList li{
  list-style: none;
  width:23%;
  border:1px solid #E5E9F2;
  height: auto;
  overflow: hidden; 
  background-color:#fff;
  padding: 2px; 
  float:left; 
  margin: 3px;

}
.cookList li span{
  display: block;
  float:left;  
}
.foodImg{
  width: 40%;
}
.foodName{
  font-size: 18px;
  padding-left: 10px;
  color:brown;

}
.foodPrice{
  font-size: 16px;
  padding-left: 10px;
  padding-top:10px;
}

</style>
