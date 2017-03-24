using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    public class comp
    {
        public int id { get; set; }

        public string comId { get; set; }
        public string comName { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string comLinker { get; set; }
        public string tel { get; set; }
        public string linePrice { get; set; }
        public string zbr { get; set; }
        public string createAt { get; set; }
        public string comment { get; set; }
        public string sh { get; set; }
        public string shdate { get; set; }

    }
    /// <summary>
    /// comM 的摘要说明
    /// </summary>
    public class company : IHttpHandler
    {
        HttpContext context;
        string strReturn = "";
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Dictionary<string, object> d = new Dictionary<string, object>();
        public void ProcessRequest(HttpContext context)
        {
            this.context = context;
            string cmd = context.Request.Params["cmd"].ToString();
            switch (cmd)
            {
                case "list":
                    strReturn = GetComList();
                    break;
                case "add":
                    strReturn = AddCom();
                    break;
                case "edit":
                    strReturn = EditCom();
                    break;
                case "del":
                    strReturn = DelCom();
                    break;
                case "excel":
                    strReturn = GetExcelAddress();
                    break;
                case "edit_frm":
                    strReturn = EditCom_frm();
                    break;
            }
            context.Response.Write(strReturn);
        }

        public string GetExcelAddress()
        {
            return "";
        }

        /// 删除用户
        /// </summary>
        /// <returns></returns>
        public string DelCom()
        {
            try
            {
                string deluserids = context.Request.Form["deluserids"].ToString();
                if (deluserids.IndexOf("_") > 0)
                {
                    bool b = true;
                    string[] aUserIds = deluserids.Split('_');
                    foreach (var suserid in aUserIds)
                    {
                        int id = Convert.ToInt32(suserid);
                        string strSql = string.Format("delete company where id={0}", id);
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
                    string strSql = string.Format("delete company where id={0}", deluserids);
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

        /// 更新用户
        /// </summary>
        /// <returns></returns>
        public string EditCom()
        {
            try
            {
                string comId = context.Request.Form["comId"].ToString();
                string comName = context.Request.Form["comName"].ToString();
                string address = context.Request.Form["address"].ToString();
                string city = context.Request.Form["city"].ToString();
                string comLinker = context.Request.Form["comLinker"].ToString();
                string tel = context.Request.Form["tel"].ToString();
                string linePrice = context.Request.Form["linePrice"].ToString();
                string zbr = context.Request.Form["zbr"].ToString();
                string createAt = context.Request.Form["createAt"].ToString();
                string comment = context.Request.Form["comment"].ToString();
                int edituserid = Convert.ToInt32(context.Request.QueryString["edituserid"].ToString());//获取到更新的userid
                string strSql = string.Format("update company set comId='{0}',comName='{1}',address='{2}',city='{3}',comLinker='{4}',tel='{5}',linePrice='{6}',zbr='{7}',createAt='{8}',comment='{9}' where id={10}", comId, comName, address, city, comLinker, tel, linePrice, zbr, createAt, comment, edituserid);
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
        /// <summary>
        /// 增加公司信息
        /// </summary>
        /// <returns></returns>
        public string AddCom()
        {
            try
            {
                string comId = context.Request.Form["comId"].ToString();
                string comName = context.Request.Form["comName"].ToString();
                string address = context.Request.Form["address"].ToString();
                string city = context.Request.Form["city"].ToString();
                string comLinker = context.Request.Form["comLinker"].ToString();
                string tel = context.Request.Form["tel"].ToString();
                string linePrice = context.Request.Form["linePrice"].ToString();
                string zbr = context.Request.Form["zbr"].ToString();
                string createAt = context.Request.Form["createAt"].ToString();
                string comment = context.Request.Form["comment"].ToString();

                string strSql = string.Format("insert into company(comId,comName,address,city,comLinker,tel,linePrice,zbr,createAt,comment) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')", comId, comName, address, city, comLinker, tel, linePrice, zbr, createAt, comment);
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

        public string GetComList()
        {
            string strWhere = context.Request.Form["strWhere"].ToString();
            int pageindex = Convert.ToInt32(context.Request.Form["page"].ToString());
            int pagesize = Convert.ToInt32(context.Request.Form["rows"].ToString());
            string strCount = "select count(*) from company where " + strWhere;
            int count = Convert.ToInt32(SqlHelper.ExecuteScalarText(strCount).ToString());
            string str = string.Format(@"SELECT TOP {0} * 
FROM 
        (
        SELECT ROW_NUMBER() OVER (ORDER BY id desc) AS RowNumber,* FROM company where {2}
        ) A
WHERE RowNumber > {0}*({1}-1)", pagesize, pageindex, strWhere);
            DataTable dt = SqlHelper.ExecuteDataSetText(str, null).Tables[0];
            d.Add("total", count);
            List<comp> list = new List<comp>();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    comp com = new comp();
                    com.id = Convert.ToInt32(dt.Rows[i]["id"].ToString());
                    com.comId = dt.Rows[i]["comId"].ToString();
                    com.comName = dt.Rows[i]["comName"].ToString();
                    com.address = dt.Rows[i]["address"].ToString();
                    com.city = dt.Rows[i]["city"].ToString();
                    com.comLinker = dt.Rows[i]["comLinker"].ToString();
                    com.tel = dt.Rows[i]["tel"].ToString();
                    com.linePrice = dt.Rows[i]["linePrice"].ToString();
                    com.zbr = dt.Rows[i]["zbr"].ToString();
                    com.createAt = dt.Rows[i]["createAt"].ToString();
                    com.comment = dt.Rows[i]["comment"].ToString();
                    com.sh = dt.Rows[i]["sh"].ToString();
                    com.shdate = dt.Rows[i]["shdate"].ToString();
                    list.Add(com);
                }
            }
            d.Add("rows", list);
            return jss.Serialize(d);
        }

        /// 更新详情页公司信息
        /// </summary>
        /// <returns></returns>
        public string EditCom_frm()
        {
            try
            {
                string comId = context.Request["comId"].ToString();
                string comName = context.Request["comName"].ToString();
                string address = context.Request["address"].ToString();
                string city = context.Request["city"].ToString();
                string comLinker = context.Request["comLinker"].ToString();
                string tel = context.Request["tel"].ToString();
                string linePrice = context.Request["linePrice"].ToString();
                string zbr = context.Request["zbr"].ToString();
                string createAt = context.Request["createAt"].ToString();
                string comment = context.Request["comment"].ToString();
                int clean = Convert.ToInt32(context.Request["clean"].ToString());

                string strSql = string.Format("update company set comId='{0}',comName='{1}',address='{2}',city='{3}',comLinker='{4}',tel='{5}',linePrice='{6}',zbr='{7}',createAt='{8}',comment='{9}',clean='{10}' where comId='{11}'", comId, comName, address, city, comLinker, tel, linePrice, zbr, createAt, comment, clean, comId);
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
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

}

