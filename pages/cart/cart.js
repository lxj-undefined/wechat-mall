// pages/cart/cart.js
Page({

  /**
   * 添加地址功能:
   * 1.调用微信内置API 获取用户地址 wx.chooseAddress
   * 注:为了防止用户点击了取消，导致之后也获取不到的问题 authSetting:scope.address: false
   * 当用户拒绝之后，重新让用户给予权限 
   * 坑:要authSetting["scope.address"]这样获取
   */
  /**
   * 页面加载完之后获取本地缓存数据:(每次进入都加载一遍)
   * 1.获取缓存的地址数据
   * 2.把数值给data
   */
  /**
   * onShow把缓存数据放入购物车中
   * 1.获取缓存中的数组
   * 2.填充数据
   */
  /**
   * 全选的实现 数据展示
   * 1.获取缓存中的cart
   * 2.满足：所有购物车里的商品被选中时，全选勾上；勾选全选，所有购物车的商品被选上
   */
  /**
   * 总价格的计算实现
   * 1.计算被选中的商品
   * 2.获取购物车数组
   * 3.遍历，计算被选中的商品价格
   * 4.一种商品总价格=单价*购买数量
   * 5.总价=一种商品总价格+n
   * 6.商品件数
   * 7.返回数值
   */
  /**
   * 商品选中事件
   * 1.绑定change事件，
   * 2.获取被修改的对象
   * 3.改变data数据和缓存数据
   * 4.重新计算选择的
   */
  /**
   * 全选和反选
   */
  /**
   * 商品数量加减
   */
  /**
   * 点击结算
   * 1.收货地址信息
   * 2.购物车是否为空
   * 3.跳转支付
   */

  /**
   * 页面的初始数据
   */
  data: {

    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    discountPrice: 0

  },
  //获得收货地址
  ChooseAddress() {

    wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting['scope.address'];
        if (scopeAddress === false) {
          //用户曾经拒绝过,跳转到权限授予
          wx.openSetting({
            success: (resultSe) => {
              // console.log(resultSe);
              wx.chooseAddress({
                success: (resultAdd) => {
                  // console.log(resultAdd);
                  //存入到缓存中
                  resultAdd.all = resultAdd.provinceName + resultAdd.cityName + resultAdd.countyName + resultAdd.detailInfo;
                  wx.setStorageSync("address", resultAdd);
                }
              });
            },
            fail: () => {},
            complete: () => {}
          });

        } else {
          //没拒绝或没点击过
          wx.chooseAddress({
            success: (resultAdd) => {
              // console.log(resultAdd);
              //存入到缓存中
              resultAdd.all = resultAdd.provinceName + resultAdd.cityName + resultAdd.countyName + resultAdd.detailInfo;
              wx.setStorageSync("address", resultAdd);
            }
          });
        }
      }
    });

  },
  //商品选择
  checkedChange(e) {
    //获取被修改的商品
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.id === goods_id);
    //状态取反(选和取消)
    cart[index].checked = !cart[index].checked;
    //重新设置缓存和data
    this.refreshCartStatus(cart);
  },
  //商品的全选
  allCheckedChange() {

    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.refreshCartStatus(cart);
  },
  //刷新购物车状态的时候重新计算购物车内的数据
  refreshCartStatus(cart) {

    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    const userInfo = wx.getStorageSync("user_info");

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.disPrice;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    //判断会员和会员打折
    totalPrice = this.vipDiscount(userInfo.isVip, totalPrice);
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    //重新设置回data和缓存中
    wx.setStorageSync("cart", cart);
    this.setData({
      cart: cart,
      allChecked: allChecked,
      totalPrice: totalPrice,
      totalNum: totalNum
    });
  },
  //加减功能实现
  //减
  reduceOne(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //获取data和缓存中的数据
    let {
      cart
    } = this.data;
    let index = cart.findIndex(v => v.id === goods_id);
    //修改num
    if (cart[index].num > 1) {
      cart[index].num -= 1;
    } else if (cart[index].num == 1) {
      cart.splice(index);
    }
    //刷新
    this.refreshCartStatus(cart);
  },
  //加
  plusOne(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //获取data和缓存中的数据
    let {
      cart
    } = this.data;
    let index = cart.findIndex(v => v.id === goods_id);
    //修改num
    cart[index].num += 1;
    //刷新
    this.refreshCartStatus(cart);
  },
  //结算
  toPay() {
    const {
      address,
      totalNum
    } = this.data;
    //判断收货地址
    if (!address.userName) {
      wx.showToast({
        title: '您还没有添加收货地址!',
        icon: 'none',
        mask: true
      });

      return;
    }
    //判断购物车是否为空  
    if (totalNum === 0) {
      wx.showToast({
        title: '购物车中没有商品!',
        icon: 'none',
        mask: true
      });

      return;
    }
    
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
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
        discountPrice:discountPrice
      });
      return totalPrice;
    } else {
      return totalPrice;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let userInfo = wx.getStorageSync("user_info");
    if (!userInfo.nickName) {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，是否跳转到登陆页面?',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      });
    }


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
    const cart = wx.getStorageSync("cart") || [];
    //1.计算全选
    this.refreshCartStatus(cart);

    //把值给data
    this.setData({
      address: address
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