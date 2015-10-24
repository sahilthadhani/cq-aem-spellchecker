package au.com.biztechaem.core.impl.servlets;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.swabunga.spell.engine.SpellDictionaryHashMap;
import com.swabunga.spell.event.SpellCheckEvent;
import com.swabunga.spell.event.SpellCheckListener;
import com.swabunga.spell.event.SpellChecker;
import com.swabunga.spell.event.StringWordTokenizer;

import net.htmlparser.jericho.Source;

@SlingServlet(paths="/bin/aemfeatures/spellChecker", metatype=true)
@Properties(value = {
		@Property(label="dictionary.location",name = "dictionary.location", value = "crx-quickstart/conf/en.0"),
		@Property(label="phonet.location",name = "phonet.location", value = "crx-quickstart/conf/phonet.en")})
public class SpellCheckerServlet extends SlingAllMethodsServlet implements SpellCheckListener{

	/**
	 * Default Serial Version Id
	 */
	private static final long serialVersionUID = 1099399200233L;

	private final Logger log = LoggerFactory.getLogger(SpellCheckerServlet.class);

	String dictionaryLocation =StringUtils.EMPTY;
	String phonetLocation = StringUtils.EMPTY;

	private List<String> wrongWords = null;

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

		try {
			wrongWords = new ArrayList<String>();
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			File file = new File(this.dictionaryLocation);
			SpellDictionaryHashMap dictionary =  new SpellDictionaryHashMap(file, new File(this.phonetLocation));
			SpellChecker spellChecker = new SpellChecker(dictionary);
			spellChecker.addSpellCheckListener(this);
			String bodyText = request.getParameter("bodyText");
			Source source = new Source(bodyText);
			if(null!=source){
				spellChecker.checkSpelling(new StringWordTokenizer(source.getTextExtractor().toString()));
			}
			out.print(new JSONArray(wrongWords));
			out.flush();
		} catch (Exception e) {
			throw new ServletException("Cannot parse multipart request.", e);
		}
	}



	@Override
	public void spellingError(SpellCheckEvent event) {
		wrongWords.add(event.getInvalidWord());
	}

	public static String replaceHtmlCharactersToText(String textToReplace) {
		return textToReplace.replaceAll("\\<[^>]*>","");
	}

}
