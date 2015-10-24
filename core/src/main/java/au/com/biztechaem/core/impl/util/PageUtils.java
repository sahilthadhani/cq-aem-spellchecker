package au.com.biztechaem.core.impl.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import com.day.cq.wcm.api.Page;

public  class PageUtils {

	// Utility Class, Don't allow instantiation
	private PageUtils(){

	}

	/**
	 * This method will return all the page paths underneath the source page. 
	 * @param srcPage
	 * @return List of Page Paths under the paths Specified
	 */
	public static List<String> findAllChildPagePaths(Page srcPage){
		List<String> allChildPagePaths = new ArrayList<String>();
		if(null!= srcPage){
			Iterator<Page> childPages = srcPage.listChildren();
			while(childPages.hasNext()){
				Page childPage = childPages.next();
				allChildPagePaths.add(childPage.getPath());
				if (childPage.listChildren().hasNext()) {
					allChildPagePaths.addAll(findAllChildPagePaths(childPage));
				}
			}
			//Add all the child pages and then add the parent page.
			allChildPagePaths.add(srcPage.getPath());
		}
		return allChildPagePaths;
	}

	/**
	 * This method returns a list all the nodes under a given node.
	 * @param src
	 * @return All a List of Nodes
	 * @throws RepositoryException
	 */
	public static List<Node> findallNodesInPage(Node src) throws RepositoryException {
		NodeIterator pageNodes = src.getNodes();
		List<Node> allChildNodes = new ArrayList<Node>();
		while (pageNodes.hasNext()) {
			Node st = pageNodes.nextNode();
			allChildNodes.add(st);
			if (st.hasNodes()) {
				allChildNodes.addAll(findallNodesInPage(st));
			}
		}
		return allChildNodes;
	}

	/**
	 * This method will return all the page paths underneath the source page but does not return excluded paths 
	 * @param srcPage
	 * @return List of Page Paths under the paths Specified but excluded pages or any anything beneath excluded path
	 */
	public List<String> findAllChildPagePaths(Page srcPage, List<String> excludedPagePaths, boolean includeChildOfExcludedPaths){
		List<String> allChildPagePaths = new ArrayList<String>();
		if(null!=srcPage){
			Iterator<Page> childPages = srcPage.listChildren();
			while(childPages.hasNext()){
				Page childPage = childPages.next();
				for(String excludedPages : excludedPagePaths){
					if(!childPage.getPath().contains(excludedPages)){
						allChildPagePaths.add(childPage.getPath());
						if (childPage.listChildren().hasNext()) {
							allChildPagePaths.addAll(findAllChildPagePaths(childPage));
						}
					}else if(includeChildOfExcludedPaths  && !excludedPages.equals(childPage.getPath())){
						allChildPagePaths.add(childPage.getPath());
						if (childPage.listChildren().hasNext()) {
							allChildPagePaths.addAll(findAllChildPagePaths(childPage));
						}
					}else{
						//break the for loop but continue with the while loop
						break;
					}
				}
			}
			//Add all the child pages and then add the parent page.
			allChildPagePaths.add(srcPage.getPath());
		}
		return allChildPagePaths;
	}

}


