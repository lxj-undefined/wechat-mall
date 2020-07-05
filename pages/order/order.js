// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    tabs: [{
        type: 1,
        value: "全部订单",
        isAction: true
      },
      {
        type: 2,
        value: "待付款",
        isAction: false
      },
      {
        type: 3,
        value: "待发货",
        isAction: false
      },
      {
        type: 4,
        value: "退货/换货",
        isAction: false
      }
    ],
    order:[]

  },
  tabsItemChange(e) {
    //获取点击索引
    const {
      index
    } = e.detail;
    //刷新页面数据
    this.refreshOrderStatus(index);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //onShow拿不到options
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

    //获取当前小程序页面栈
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let {
      type
    } = currentPage.options;
    //跳转时进行修改页面
    this.getTypeFromMe(type);
    //获取payed数据
    this.getOrder();
  },
  //接受个人中心的数据进行跳转
  getTypeFromMe(type) {
    let index = parseInt(type) - 1;
    this.refreshOrderStatus(index);
  },
  //刷新页面
  refreshOrderStatus(index) {
    //获取tabs
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isAction = true : v.isAction = false);
    //设置值
    this.setData({
      tabs: tabs
    })
  },
  //获取payed数据
  getOrder(){
    const order  = wx.getStorageSync("order");
    this.setData({
      order:order
    });
      
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