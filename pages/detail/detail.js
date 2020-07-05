// pages/detail/detail.js
//引用es6
import { request } from "../../request/index.js";
//引用es7
import regeneratorRunTime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //商品详情
    goodsDetail:{},

    goods_id:0

  },
  //全局数据
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //接受参数
    this.goods_id=options.id;

    // console.log(options);
    //获取商品详情
    this.getCurrentGoods(this.goods_id)
  },
  /**
   * 
   * 跳转到首页
   */
  toIndex(){
    wx.switchTab({
      url:'../index/index'
    });
  },
  /**
   * 
   * 跳转到购物车
   */
  toCart(){
    wx.switchTab({
      url:'../cart/cart'
    });
  },
  /**
   * 
   * 带参数跳转到购物车
   */
  addToCart(){
    // wx.reLaunch({
    //   url:'../cart/cart?id='+this.goods_id
    // });
    // console.log(this.GoodsInfo);
    //1.获取缓存中的数组
    let cart = wx.getStorageSync("cart")||[];
    //判断是否存在于购物车中(v.id是数组里面的id)
    let index = cart.findIndex(v=>v.id===this.GoodsInfo.id);
    if(index===-1){
      //不存在，第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);

    }else{
      //已存在执行加一
      cart[index].num++;
    }
    //把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      image: '',
      //设置为true 每1.5s之后才能点击
      mask: true,
      success: (result) => {
        
      }
    });
    
  },
  /**
   * 
   * 带参数跳转到提交订单页
   */
  justBuy(){
    let cart = wx.getStorageSync("cart")||[];
    //判断是否存在于购物车中(v.id是数组里面的id)
    let index = cart.findIndex(v=>v.id===this.GoodsInfo.id);
    if(index===-1){
      //不存在，第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);

    }else{
      //已存在执行加一
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);
    wx.switchTab({
      url: '/pages/cart/cart'
    });
      
  },
  /**
   * 
   * 根据id获取商品详情 
   */
  getCurrentGoods(goodsId){
    let temp = this;
    wx.request({
      url: 'https://www.fastmock.site/mock/79368657b7980fedf95887ac44d587e9/detail/detail/id='+goodsId,     
      success: function(res){
        // console.log(res);
        if(res.data.code===0){
          temp.setData({
            goodsDetail:res.data.data.goodsDetail,
          });
          temp.GoodsInfo = res.data.data.goodsDetail||{};
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})