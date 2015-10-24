package au.com.biztechaem.core.impl.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

public class JcrPropertyUtil {

	// Utility Class, Don't allow instantiation
	private JcrPropertyUtil (){

	}

	private static String [] propertiesToExclude = new String []{"cq:lastReplicatedBy","sling:resourceType","cq:lastModifiedBy",
			"jcr:uuid","jcr:createdBy","cq:template","ogtype","robots","imageRotate","fileReference"};
	private static List<String> propertyListToExclude = Arrays.asList(propertiesToExclude);
	/**
	 * Utility method to retrieve all string or string array properties. 
	 * @param srcNode
	 * @return Returns all the string or string array properties in a Map for iteration
	 * @throws RepositoryException
	 */
	public static Map<String, List<Value>> getStringPropertyValues (Node srcNode) throws RepositoryException{
		Map<String, List<Value>> stringPropertyMap = new HashMap<String, List<Value>>();
		if(null!=srcNode){
			PropertyIterator propIterator =srcNode.getProperties();
			while(propIterator.hasNext()){
				Property prop = propIterator.nextProperty();
				if(!propertyListToExclude.contains(prop.getName())){
					if(prop.isMultiple() && prop.getType()==PropertyType.STRING){
						stringPropertyMap.put(prop.getName(), Arrays.asList(prop.getValues()));
					}else if(prop.getType()==PropertyType.STRING){
						stringPropertyMap.put(prop.getName(), Collections.singletonList(prop.getValue()));
					}
				}
			}
		}
		return stringPropertyMap;

	}

	/**
	 * Utility method to retrieve all properties 
	 * @param srcNode
	 * @return Returns all the string or string array properties in a Map for iteration
	 * @throws RepositoryException
	 */
	public static Map<String, List<Value>> getPropertyValues (Node srcNode) throws RepositoryException{
		Map<String, List<Value>> propertyMap = new HashMap<String, List<Value>>();
		if(null!=srcNode){
			PropertyIterator propIterator =srcNode.getProperties();
			while(propIterator.hasNext()){
				Property prop = propIterator.nextProperty();
				if(!propertyListToExclude.contains(prop.getName())){
					if(prop.isMultiple()){
						propertyMap.put(prop.getName(), Arrays.asList(prop.getValues()));
					}else{
						propertyMap.put(prop.getName(), Collections.singletonList(prop.getValue()));
					}
				}
			}
		}
		return propertyMap;

	}

}
