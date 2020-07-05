Page({

  /**
   * 页面的初始数据
   */
  data: {

    //被点击的菜单索引
    currentIndexNav:0,
    //首页导航数据
    categoriesList:[],
    //轮播图
    swiperList:[],
    //商品列表数据
    goodsList:[]
  },

  //点击时绑定事件
  activeNav(e){
    // console.log(123);
    this.setData({
      currentIndexNav:e.target.dataset.index
    })
  },

  /**
   * 获取首页导航数据
   */
  getNavList(){

    let temp = this;
    //内置发送请求的方式
    wx.request({
      url: 'https://www.fastmock.site/mock/a0424fe4d9a3b75e6466980a7480be34/shop/category',
      success: function(res){
        // success
        // console.log(res);
        if(res.data.code===0){
          temp.setData({
            categoriesList: res.data.data.categoriesList
          })
        }
      }
    })
  },

  /**
   * 
   * 获取轮播图
   */
  getSwiperList(){
    let temp = this;
    wx.request({
      url:"https://www.fastmock.site/mock/1566a903dd340481a772ad3ca1873819/imges1/images",
      success:function(res){
        // console.log(res);
        if(res.data.code===0){
          temp.setData({
            swiperList:res.data.data.swiperList
          })
        }
      }
    })
  },

  /**
   * 
   * 获取商品列表
   */
  getGoodsList(){
    let temp = this;
    wx.request({
      url:"https://www.fastmock.site/mock/6372fb779c59babf8c2918a700bd5b08/list/list",
      success:function(res){
        // console.log(res);
        if(res.data.code===0){
          temp.setData({
            goodsList:res.data.data.goodsList
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取首页导航数据
    this.getNavList();

    //获取轮播图数据
    this.getSwiperList();

    //获取商品数据
    this.getGoodsList();
    
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
