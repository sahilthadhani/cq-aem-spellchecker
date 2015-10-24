package au.com.biztechaem.core.impl.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class TagExtractionUtil {
	
	private TagExtractionUtil(){
		//Don't allow instantiation
	}
	
	private static final String ANCHOR_TAG ="a";
	private static final String HREF_ATTRIBUTE ="href";
	private static final String HASH_ATTRIBUTE ="#";
	private static final String JAVASCRIPT_ATTRIBUTE ="javascript";
	private static final String IMAGE_TAG ="img";
	private static final String IMAGE_SRC_ATTRIBUTE ="src";
	private static final String MAIL_ATTRIBUTE ="mail";
	
	/**
	 * Parses anchor attribute from in the propertyValue and returns list 
	 * which has href attribute value
	 * @param propertyValue
	 * @return href value from the parsed anchor tag
	 */
	public static List<String> extractHrefFromAnchor(String propertyValue){
		List<String> hrefList = new ArrayList<String>();
		Document doc = Jsoup.parse(propertyValue);
		Iterator<Element> itr = doc.select(ANCHOR_TAG).iterator();
		while(itr.hasNext()){
			Element link = itr.next();
			if(null!=link && StringUtils.isNoneBlank(link.attr(HREF_ATTRIBUTE)) && 
					!link.attr(HREF_ATTRIBUTE).startsWith(HASH_ATTRIBUTE) 
					&& !link.attr(HREF_ATTRIBUTE).startsWith(JAVASCRIPT_ATTRIBUTE)
					&& !link.attr(IMAGE_SRC_ATTRIBUTE).startsWith(MAIL_ATTRIBUTE)){
				hrefList.add(link.attr(HREF_ATTRIBUTE));
			}
		}
		return hrefList;
	}
	
	/**
	 * Pass the property name to extract the src attributes as list
	 * @param propertyValue
	 * @return returns the list of values by extracting src attribute from Image tag <img scr="http://google.com"/> will return http://google.com 
	 */
	public static List<String> extractSrcAttrFromImage(String propertyValue){
		List<String> imgSrcList = new ArrayList<String>();
		Document doc = Jsoup.parse(propertyValue);
		Iterator<Element> itr = doc.select(IMAGE_TAG).iterator();
		while(itr.hasNext()){
			Element link = itr.next();
			if(null!=link && StringUtils.isNoneBlank(link.attr(IMAGE_SRC_ATTRIBUTE)) && 
					!link.attr(IMAGE_SRC_ATTRIBUTE).startsWith(HASH_ATTRIBUTE) 
					&& !link.attr(IMAGE_SRC_ATTRIBUTE).startsWith(JAVASCRIPT_ATTRIBUTE) 
					&& !link.attr(IMAGE_SRC_ATTRIBUTE).startsWith(MAIL_ATTRIBUTE)){
				imgSrcList.add(link.attr(IMAGE_SRC_ATTRIBUTE));
			}
		}
		return imgSrcList;
	}

}
