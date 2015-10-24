package au.com.biztechaem.core.impl.util;

import org.apache.sling.api.SlingHttpServletRequest;

public class MiscUtil {
	
	private MiscUtil(){
		
	}
	/**
	 * Href passed returns a valid with scheme & Port
	 * @param href
	 * @param request
	 * @return valid href
	 */
	public static String getValidHref(String href, SlingHttpServletRequest request){
		StringBuilder requestAttrBuilder = new StringBuilder(70);
		if(!href.startsWith("http") && !href.startsWith("https")){
			requestAttrBuilder.append(request.getScheme()+"://");
			requestAttrBuilder.append(request.getServerName());
			if(request.getServerPort()>0){
				requestAttrBuilder.append(":");
				requestAttrBuilder.append(request.getServerPort());
			}
			requestAttrBuilder.append(href);
			return requestAttrBuilder.toString();
		}
		
		return href;
	}

}
