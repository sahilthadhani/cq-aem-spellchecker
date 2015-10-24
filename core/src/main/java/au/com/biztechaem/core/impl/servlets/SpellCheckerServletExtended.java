package au.com.biztechaem.core.impl.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.swabunga.spell.engine.SpellDictionaryHashMap;
import com.swabunga.spell.event.SpellCheckEvent;
import com.swabunga.spell.event.SpellCheckListener;
import com.swabunga.spell.event.SpellChecker;
import com.swabunga.spell.event.StringWordTokenizer;

import au.com.biztechaem.core.impl.Constants;
import au.com.biztechaem.core.impl.util.MiscUtil;
import au.com.biztechaem.core.impl.util.PageUtils;
import net.htmlparser.jericho.Source;

@SlingServlet(paths="/bin/aemfeatures/spellCheckerExtended", metatype=true)
@Properties(value = {
		@Property(label="dictionary.location",name = "dictionary.location", value = "crx-quickstart/conf/en.0"),
		@Property(label="phonet.location",name = "phonet.location", value = "crx-quickstart/conf/phonet.en")})
public class SpellCheckerServletExtended extends SlingAllMethodsServlet implements SpellCheckListener{

	/**
	 * Default Serial Version Id
	 */
	private static final long serialVersionUID = 1099399200233L;

	/** If Site Section is missing, all the sites within instance would be parsed **/
	private final String DEFAULT_SITE_SECTION_PATH = "/content";

	private final String SITE_SECTION = "siteSection";

	private OutputStream out;

	private String currentPagePath = StringUtils.EMPTY;

	private final Logger log = LoggerFactory.getLogger(SpellCheckerServletExtended.class);
	
	String dictionaryLocation =StringUtils.EMPTY;
	String phonetLocation = StringUtils.EMPTY;
	
	@Activate
	public void activate(final Map<String, String> properties) {
		this.dictionaryLocation = PropertiesUtil.toString(properties.get("dictionary.location"), StringUtils.EMPTY);
		this.phonetLocation = PropertiesUtil.toString(properties.get("phonet.location"), StringUtils.EMPTY);
		log.info("Phonet location is {} and dictionarylocation is {}",this.phonetLocation,this.dictionaryLocation);
	}

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {

		doPost(request, response);
	}

	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException{
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String reportName = "SpellCheckerReport"+sdf.format(new Date());;
		response.setContentType(Constants.CONTENT_MS_EXCEL);
		response.setHeader(Constants.CACHE_CONTROL,Constants.CACHE_CONTOL_PUBLIC);
		response.setHeader(Constants.CACHE_CONTROL,Constants.CACHE_CONTROL_CHECK);
		response.setHeader(Constants.EXPIRES, Constants.ZERO);
		response.setHeader(Constants.CONTENT_DISPOSITION, Constants.ATTATCHEMENT.concat(reportName).concat(Constants.CSV_EXTENSION));
		String wordsNotToList [] = null;
		try {
			out = response.getOutputStream();
			out.write("MissSpelledWord, PagePath".getBytes());
			out.write(("\n").getBytes());
			File file = new File(this.dictionaryLocation);
			SpellDictionaryHashMap dictionary =  new SpellDictionaryHashMap(file, new File(this.phonetLocation));
			SpellChecker spellChecker = new SpellChecker(dictionary);
			spellChecker.addSpellCheckListener(this);
			ResourceResolver resolver = request.getResourceResolver();
			String siteAreaToParse = DEFAULT_SITE_SECTION_PATH;

			final boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			if (isMultipart) {
				final Map<String, RequestParameter[]> params = request.getRequestParameterMap();
				for (final Map.Entry<String, RequestParameter[]> pairs : params.entrySet()) {
					final String k = pairs.getKey();
					final RequestParameter[] pArr = pairs.getValue();
					final RequestParameter param = pArr[0];
					if (param.isFormField()) {
						if(param.getName().equals((SITE_SECTION))){
							siteAreaToParse=param.getString();
						}
					}else {
						InputStream fileContent = param.getInputStream();
						BufferedReader in = new BufferedReader(
								new InputStreamReader(fileContent));
						String inputLine;
						StringBuilder sb = new StringBuilder(3000);
						while ((inputLine = in.readLine()) != null){
							sb.append(inputLine);
						}
						wordsNotToList  = sb.toString().split(",");
					}
				}
			}

			if(null!=resolver.getResource(siteAreaToParse)){
				Page sectionToParse = resolver.getResource(siteAreaToParse).adaptTo(Page.class);
				List<String> pagePaths = PageUtils.findAllChildPagePaths(sectionToParse);
				//Iterate over all the pages.
				for(String pagePath: pagePaths){
					String url = MiscUtil.getValidHref(pagePath, request)+".html";
					currentPagePath = url;
					URL stream = new URL(url);
					BufferedReader in = new BufferedReader(
							new InputStreamReader(stream.openStream()));

					String inputLine;
					StringBuilder sb = new StringBuilder(3000);
					while ((inputLine = in.readLine()) != null){
						sb.append(inputLine);
					}
					String finalPagebodyToProcess = sb.toString();
					if(null!=wordsNotToList){
						for(String str:wordsNotToList){
							finalPagebodyToProcess = finalPagebodyToProcess.replaceAll(str, "");
						}
					}

					Document doc = Jsoup.parse(finalPagebodyToProcess);
					if(null!=doc){
						Element element = doc.select("body").first();
						if(null!=element){
							Source source = new Source(element.text());
							if(null!=source){
								spellChecker.checkSpelling(new StringWordTokenizer(source.getTextExtractor().toString()));
							}
						}
					}
					in.close();
				}
				out.flush();
			}
		} catch (IOException e) {
			throw new ServletException("Cannot parse multipart request.", e);
		}
	}



	@Override
	public void spellingError(SpellCheckEvent event) {
		try {
			out.write((event.getInvalidWord()+","+currentPagePath+"\n").getBytes());
		} catch (IOException e) {
			throw new RuntimeException("Exception in method Spelling Error",e);
		}

	}

}
