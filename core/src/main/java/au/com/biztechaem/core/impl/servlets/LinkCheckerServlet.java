package au.com.biztechaem.core.impl.servlets;

import java.io.IOException;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import com.day.cq.rewriter.linkchecker.Link;
import com.day.cq.rewriter.linkchecker.LinkChecker;
import com.day.cq.rewriter.linkchecker.LinkCheckerSettings;
import com.day.cq.wcm.api.Page;

import au.com.biztechaem.core.impl.Constants;
import au.com.biztechaem.core.impl.util.JcrPropertyUtil;
import au.com.biztechaem.core.impl.util.MiscUtil;
import au.com.biztechaem.core.impl.util.PageUtils;
import au.com.biztechaem.core.impl.util.TagExtractionUtil;

@SlingServlet(paths="/bin/aemfeatures/linkChecker", metatype=false)
public class LinkCheckerServlet extends SlingAllMethodsServlet{

	/**
	 * Default Serial Version Id
	 */
	private static final long serialVersionUID = 1099399200233L;
	
	@Reference(cardinality=ReferenceCardinality.MANDATORY_UNARY)
	private LinkChecker linkChecker;
	
	/** If Site Section is missing, all the sites within instance would be parsed **/
	private final String DEFAULT_SITE_SECTION_PATH = "/content";
	
	private final String SITE_SECTION = "siteSection";
	
	private final String COMMA =",";
	
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {
		
		doPost(request, response);
	}
	
	//TODO: Put an option to report relative / concrete links
	// TODO: Author Author environment link should be reported broken ( Andrew Lewis Reported the problem), the link should be relative.
	
	//TODO: List all domains to exclude /include domain checking. 
	
	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException{
		try{
		Map<String,RequestParameter[]> parameters = request.getRequestParameterMap();
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String reportName = "linkCheckerReport"+sdf.format(new Date());;
		response.setContentType(Constants.CONTENT_MS_EXCEL);
		response.setHeader(Constants.CACHE_CONTROL,Constants.CACHE_CONTOL_PUBLIC);
		response.setHeader(Constants.CACHE_CONTROL,Constants.CACHE_CONTROL_CHECK);
		response.setHeader(Constants.EXPIRES, Constants.ZERO);
		response.setHeader(Constants.CONTENT_DISPOSITION, Constants.ATTATCHEMENT.concat(reportName).concat(Constants.CSV_EXTENSION));
		LinkCheckerSettings linkCheckerSettings = linkChecker.createSettings(request);
		OutputStream out = response.getOutputStream();
		out.write("Node,PagePath,Link Source,Status".getBytes());
		out.write(("\n").getBytes());
		
		ResourceResolver resolver = request.getResourceResolver();
		String siteAreaToParse = null!=parameters.get(SITE_SECTION)?parameters.get(SITE_SECTION)[0].getString():DEFAULT_SITE_SECTION_PATH;
//		String siteAreaToParse = null!=parameters.get(SITE_SECTION)?parameters.get(SITE_SECTION)[0].getString():DEFAULT_SITE_SECTION_PATH;
		boolean parseImage = true;
		List<String> imgAttrs = new ArrayList<String>();
		Page sectionToParse = resolver.getResource(siteAreaToParse).adaptTo(Page.class);
		
		List<String> pagePaths = PageUtils.findAllChildPagePaths(sectionToParse);
		//Iterate over all the pages.
		for(String pagePath: pagePaths){
			List<Node> nodesOfPage = PageUtils.findallNodesInPage(resolver.getResource(pagePath).adaptTo(Node.class));
			//Iterate over all the nodes
			for(Node node : nodesOfPage){
				Map<String, List<Value>> finalList = JcrPropertyUtil.getStringPropertyValues(node);
				//Iterate over all the properties
				for (Map.Entry<String, List<Value>> entry : finalList.entrySet()){
					//Iterate over list of properties which are either string or string array
					for(Value value : entry.getValue()){
						List<String> hrefValue = TagExtractionUtil.extractHrefFromAnchor(value.getString());
						if(parseImage){
							imgAttrs= TagExtractionUtil.extractSrcAttrFromImage(value.getString());
						}
						if(value.getType()==PropertyType.STRING && value.getString().indexOf("href")!=-1 && !hrefValue.isEmpty()){
							//Iterate over all href Values
							for(String href: hrefValue){
								Link link = linkChecker.getLink(href, linkCheckerSettings);
								out.write(concatenateData(node.getPath(), pagePath, href, link,request).getBytes());
							}
						}else if(parseImage && value.getType()==PropertyType.STRING && value.getString().indexOf("src")!=-1 && !imgAttrs.isEmpty()){
							for(String imgAttributes: imgAttrs){
								Link link = linkChecker.getLink(imgAttributes, linkCheckerSettings);
								out.write(concatenateData(node.getPath(), pagePath, imgAttributes, link,request).getBytes());
							}
						}else{
							break;
						}
					}
				}
			}
		}
		out.flush();
		}catch(RepositoryException e){
			throw new ServletException("Exception in producing link checker report",e);
		}catch(IOException e){
			throw new ServletException("IO Exception",e);
		}
		
		
		
	}
	
	private String concatenateData(String nodeName, String pagePath, String href, Link link, SlingHttpServletRequest request){
		
		StringBuilder sb = new StringBuilder(500);
		sb.append(nodeName);
		sb.append(COMMA);
		sb.append(pagePath);
		sb.append(COMMA);
//		sb.append(MiscUtil.getValidHref(href,request));
		sb.append(href);
		sb.append(COMMA);
		sb.append(link.getValidity());
		sb.append(COMMA);
		sb.append("\n");
		return sb.toString();
		
	}
	
	
	
}
