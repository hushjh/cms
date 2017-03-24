using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    /// <summary>
    /// ckGrid 的摘要说明
    /// </summary>
    public class ckm
    {
        public string createDate { get; set; }
        public string phoneNo { get; set; }
        public string cardNo { get; set; }
        public string remark { get; set; }
        public int del { get; set; }
        public int kid { get; set; }
    }
    public class ckGrid : IHttpHandler
    {
        HttpContext context;
        string strReturn = "";
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Dictionary<string, object> d = new Dictionary<string, object>();
        public void ProcessRequest(HttpContext context)
        {
            //context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
            this.context = context;
            string cmd = context.Request.Params["oper"].ToString();
            switch (cmd)
            {
                
                case "add":
                    strReturn = AddCom();
                    break;
                case "edit":
                    strReturn = EditCom();
                    break;
                case "del":
                    strReturn = DelCom();
                    break;
                case "save":
                    strReturn = SaveCom();
                    break;
                
            }
            context.Response.Write(strReturn);
        }
        public string AddCom() {
            try
            {
                string createdate = context.Request.Form["createdate"].ToString();
                string phoneno = context.Request.Form["phoneno"].ToString();
                string cardno = context.Request.Form["cardno"].ToString();
                string remark = context.Request.Form["remark"].ToString();
                int del = Convert.ToInt32(context.Request.Form["del"].ToString());

                string strSql = string.Format("insert into grid(createdate,phoneno,cardno,remark,del) values('{0}','{1}','{2}','{3}','{4}')", createdate, phoneno, cardno, remark, del);
                int i = SqlHelper.ExecteNonQueryText(strSql, null);
                if (i > 0)
                {
                    d.Add("success", true);
                }
                else
                {
                    d.Add("success", false);
                    d.Add("infor", "添加失败");
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "添加失败");
            }
            return jss.Serialize(d);
        }
        public string EditCom()
        {
            try
            {
                string createdate = context.Request.Form["createdate"].ToString();
                string phoneno = context.Request.Form["phoneno"].ToString();
                string cardno = context.Request.Form["cardno"].ToString();
                string remark = context.Request.Form["remark"].ToString();
                int del = Convert.ToInt32(context.Request.Form["del"].ToString());
                int kid = Convert.ToInt32(context.Request.Form["kid"].ToString());//获取到更新的userid
                string strSql = string.Format("update grid set createdate='{0}',phoneno='{1}',cardno='{2}',remark='{3}',del='{4}' where kid='{5}'", createdate, phoneno, cardno, remark, del, kid);
                int i = SqlHelper.ExecteNonQueryText(strSql, null);
                if (i > 0)
                {
                    d.Add("success", true);
                }
                else
                {
                    d.Add("success", false);
                    d.Add("infor", "更新失败");
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "更新失败");
            }
            return jss.Serialize(d);
        }
        public string SaveCom()
        {
            try
            {

                string data = context.Request.Params["data"].ToString();
                //json字符串转json 对象
                JavaScriptSerializer js = new JavaScriptSerializer();
                List<ckm> jc = js.Deserialize<List<ckm>>(data);
                int len = jc.Count;
                int i;
                int j;
                for ( j = 0; j < len; j++) {
                    string createdate = jc[j].createDate.ToString();
                    string phoneno = jc[j].phoneNo.ToString();
                    string cardno = jc[j].cardNo.ToString();
                    string remark = jc[j].remark.ToString();
                    int del = Convert.ToInt32(jc[j].del.ToString());
                    int kid = Convert.ToInt32(jc[j].kid.ToString());//获取到更新的userid
                    if (kid == 0) {
                        ckm pam = jc[j];
                        i=addGrid(pam);
                        
                    }else{
                        string strSql = string.Format("update grid set createdate='{0}',phoneno='{1}',cardno='{2}',remark='{3}',del='{4}' where kid='{5}'", createdate, phoneno, cardno, remark, del, kid);
                        i = SqlHelper.ExecteNonQueryText(strSql, null);
                    }
                     if (i > 0)
                     {
                         
                     }
                     else
                     {
                         d.Add("success", false);
                         d.Add("infor", "更新失败");
                         break;
                     }
                }

                d.Add("success", true);
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "更新失败");
            }
            return jss.Serialize(d);
        }
        public int addGrid(ckm pam){
            int i;
            try
            {
                string createdate = pam.createDate.ToString();
                string phoneno = pam.phoneNo.ToString();
                string cardno = pam.cardNo.ToString();
                string remark = pam.remark.ToString();
                int del = Convert.ToInt32(pam.del.ToString());

                string strSql = string.Format("insert into grid(createdate,phoneno,cardno,remark,del) values('{0}','{1}','{2}','{3}','{4}')", createdate, phoneno, cardno, remark, del);
                i = SqlHelper.ExecteNonQueryText(strSql, null);
                
            }
            catch
            {
                i = 0;
            }
            return i;
        }
        public string DelCom()
        {
            try
            {
                string delid = context.Request.Form["kid"].ToString();
                if (delid.IndexOf("_") > 0)
                {
                    bool b = true;
                    string[] aUserIds = delid.Split('_');
                    foreach (var suserid in aUserIds)
                    {
                        int id = Convert.ToInt32(suserid);
                        string strSql = string.Format("delete company where kid={0}", id);
                        int i = SqlHelper.ExecteNonQueryText(strSql, null);
                        if (i <= 0)
                        {
                            b = false;
                        }
                    }
                    if (b)
                    {
                        d.Add("success", true);
                    }
                    else
                    {
                        d.Add("success", false);
                        d.Add("infor", "删除失败");
                    }
                }
                else
                {
                    string strSql = string.Format("delete grid where kid={0}", Convert.ToInt32(delid));
                    int i = SqlHelper.ExecteNonQueryText(strSql, null);
                    if (i > 0)
                    {
                        d.Add("success", true);
                    }
                    else
                    {
                        d.Add("success", false);
                        d.Add("infor", "删除失败");
                    }
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "删除失败");
            }
            return jss.Serialize(d);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}