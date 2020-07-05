Page({

  /**
   * 加载页面
   * 从缓存中获取购物车数据
   * 挑选出checked = true
   */
  /**
   * 页面的初始数据
   */
  data: {

    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    discountPrice: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



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

    //1.获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //1.获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];

    //过滤选择出checked = true
    cart = cart.filter(v => v.checked);
    //结算金额和数量
    this.countTotal(cart);
    //把值给data
    this.setData({
      cart: cart,
      address: address
    });

  },
  countTotal(cart) {
    let totalPrice = 0;
    let totalNum = 0;
    let userInfo = wx.getStorageSync("user_info");
    cart.forEach(v => {
      totalPrice += v.num * v.disPrice;
      totalNum += v.num;
    });
    //会员打折
    totalPrice = this.vipDiscount(userInfo.isVip, totalPrice);
    //把值给data
    this.setData({
      totalPrice: totalPrice,
      totalNum: totalNum
    });
  },
  //通过会员等级来判断折扣
  discountByVipLevel() {
    let userInfo = wx.getStorageSync("user_info");
    let vipLevel = userInfo.vipLevel;
    if (vipLevel === 0) {
      return 0.9
    }
    if (vipLevel === 1) {
      return 0.8
    }
    if (vipLevel === 2) {
      return 0.7;
    }
    return 1;
  },
  //会员打折
  vipDiscount(isVip, totalPrice) {
    if (isVip) {
      //判断会员级别并打折
      let discount = this.discountByVipLevel();
      let temp = totalPrice;
      totalPrice = totalPrice * discount;
      totalPrice = Math.floor(totalPrice);
      //计算打折的减免金额
      let discountPrice = temp - totalPrice;
      discountPrice = Math.floor(discountPrice);
      this.setData({
        discountPrice: discountPrice
      });
      return totalPrice;
    } else {
      return totalPrice;
    }
  },
  payIt() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否进行付款？您的资金将会转入个人账户。',
      success(res) {
        //支付成功
        if (res.confirm) {
          wx.showToast({
            title: '支付成功!',
            icon: 'success',
            duration: 6000,
            mask: true,
            success: (result) => {
              //1.记录已经购买的数据(生成订单)
              // let payed = wx.getStorageSync("cart");
              // payed = payed.filter(v => v.checked);
              // //计算各个物品数值写入订单中
              // let order = wx.getStorageSync("order") || [];
              // var date = new Date();
              // //获取用户数据判断会员
              // const userInfo = wx.getStorageSync("user_info");
              // payed.forEach(v => {
              //   v.totalPrice = that.vipDiscount(userInfo.isVip, v.num*v.disPrice),
              //   v.createDate = date.toLocaleString(),
              //   //日期加上随即编码
              //   v.orderId = date.getTime() + Math.floor(Math.random() * (10 ^ 5));
              //   order.push(v)
              // });
              // //写入缓存(payed只作为临时函数,order作为存储已购买的订单缓存)
              // wx.setStorageSync("order", order);
              that.createOrder();

              //2.删除购物车中已经购买的的数据
              //获取数据
              let newCart = wx.getStorageSync("cart");
              //留下未被选中的
              newCart = newCart.filter(v => !v.checked);
              //更新缓存数据
              wx.setStorageSync("cart", newCart);

              //跳转到订单页面中
              wx.reLaunch({
                url: '/pages/order/order?type=1',
              });
            }
          });

        } else if (res.cancel) {
          //取消支付
          //返回到购物车中
          wx.reLaunch({
            url: '/pages/cart/cart',
          });
        }
      }
    })
  },
  //生成订单
  createOrder() {
    //1.记录已经购买的数据
    let payed = wx.getStorageSync("cart");
    payed = payed.filter(v => v.checked);
    //计算各个物品数值写入订单中
    let order = wx.getStorageSync("order") || [];
    var date = new Date();
    //获取用户数据判断会员
    let userInfo = wx.getStorageSync("user_info");
    payed.forEach(v => {
      v.totalPrice = this.vipDiscount(userInfo.isVip, v.num * v.disPrice),
        v.createDate = date.toLocaleString(),
        //日期加上随即编码
        v.orderId = date.getTime() + Math.floor(Math.random() * (10 ^ 5)),
        v.discount = this.discountByVipLevel(),
      order.push(v)
    });
    //会员付款后增加会员积分，提升等级
    if (userInfo.isVip) {
      let exp = 0;
      order.forEach(v => exp += v.totalPrice);
      console.log("1:"+exp);
      //更新会员等级
      this.updateVipLevel(exp, userInfo);
      console.log("当前vip等级:" + userInfo.vipLevel);
      //写入缓存(payed只作为临时函数,order作为存储已购买的订单缓存)
    }
    wx.setStorageSync("order", order);
  },
  //更新会员经验
  updateVipLevel(exp, userInfo) {
    //规则
    if (exp < 10000) {
      userInfo.vipLevel = 0; //打9折
    }
    if (10000 <= exp&&exp <= 20000) {
      userInfo.vipLevel = 1; //打8折
    }
    if (exp > 20000) {
      userInfo.vipLevel = 2; //打7折
    }
    console.log("2:"+exp);
    wx.setStorageSync("user_info", userInfo);

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