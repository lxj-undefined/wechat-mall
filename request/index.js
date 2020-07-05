export const request=(params)=>{
    //定义公共url
    const baseUrl = "https://www.fastmock.site/mock/a0424fe4d9a3b75e6466980a7480be34/shop";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}