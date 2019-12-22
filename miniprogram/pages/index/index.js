var app = getApp()
const devicesId = "577168089" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
const api_key = "RY48Yly9x72Xb7ul=PczeMb8nB8=" // 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=
var latitude1;
var longitude1;





Page({



  data: {

    //默认未获取地址
    markers: "",
    Height: 0,
    scale: 20,
    latitude: "",
    longitude: "",

    controls: [{
      id: 1,
      iconPath: '/assests/imgs/jian.png',
      position: {
        left: 320,
        top: 100 - 50,
        width: 20,
        height: 20
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: '/assests/imgs/jia.png',
      position: {
        left: 340,
        top: 100 - 50,
        width: 20,
        height: 20
      },
      clickable: true
    }
    ],
    circles: [],

    hasLocation: false

  },




  onLoad: function () {




    var _this = this;

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }

        })

      }
    })

//获取自身经纬度信息
    wx.getLocation({
      type: 'gcj02', //gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        latitude1 = res.latitude;
        longitude1 = res.longitude;

        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50,
            iconPath: "/assests/imgs/my.png",
            title: "我的位置"

          }],
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            radius: 30,
            strokeWidth: 1
          }]

        })
      }

    })

  },
  //根据onenet 获取孩子的经纬度

  getLocation: function (e) {

    console.log(e)

    var that = this

    const requestTask = wx.request({

      url: 'https://api.heclouds.com/devices/577168089/datapoints?datastream_id=Latitude,Longitude&limit=1',

      header: {

        'content-type': 'application/json',

        'api-key': api_key

      },

      success: function (res) {

        

        app.globalData.longitude = res.data.data.datastreams[1].datapoints[0].value

        app.globalData.latitude = res.data.data.datastreams[0].datapoints[0].value
        

        console.log(app.globalData.longitude)

        console.log(app.globalData.latitude)

        that.setData({

          hasLocation: true,

          location: {

            longitude: app.globalData.longitude,

            latitude: app.globalData.latitude

          }

        })

      }

    })

  },

  //根据经纬度在地图上显示孩子的位置

  openLocation: function (e) {

    var value = e.detail.value

    console.log(e)

    console.log(value.longitude)

    wx.openLocation({

      longitude: Number(app.globalData.longitude),

      latitude: Number(app.globalData.latitude),
      scale:18,
      address:"孩子的位置"

    })

  },
  //计算与孩子间的距离
  distance: function (la1, lo1, la2, lo2) {
    
    la1 = latitude1;
    lo1 = longitude1;
    la2 = app.globalData.latitude;
    lo2 = app.globalData.longitude;

    var that=this;
    var La1 = la1 * Math.PI / 180.0;

    var La2 = la2 * Math.PI / 180.0;

    var La3 = La1 - La2;

    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));

    s = s * 6378.137;//地球半径

    s = Math.round(s * 10000) / 10000;
    console.log(latitude1, app.globalData.latitude, longitude1, app.globalData.longitude)
    

    app.globalData.dis =s
console.log(app.globalData.dis)
    that.setData({

      

      x: {

        dis: app.globalData.dis

        

      }

    })
    
    
    
   


  },
  
  



})