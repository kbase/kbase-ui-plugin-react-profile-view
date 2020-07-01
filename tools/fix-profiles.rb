require './services'
require 'json_schemer'

$kbase_env = ENV['KBASE_ENV']

def main()
    schemaDir = "./schemas"
    dataDir = "./_temp/#{$kbase_env}"
    puts "Data dir #{dataDir}"
    Dir.entries(dataDir).each do |file|
        path = File.join(dataDir, file)
        next if File.directory? path
        user_profile = JSON.parse(File.read(path))

        # verify user
        if !user_profile.has_key? 'user'
            puts "ERROR - missing user key #{user_profile}"
            next
        end

        username = user_profile['user']['username']

        if !user_profile.has_key? 'profile'
            puts "ERROR - missing user key #{user_profile}"
            next
        end

        profile = user_profile['profile']

        # verify userdata
        next if profile == nil
        next if !profile.has_key? 'userdata'
        next if profile['userdata'] == {}
        next if profile['userdata'] == nil

        userdata = profile['userdata']


        # verify prefs

        # verify profile

        # verify affiliations

        # if user_profile['user']['username'] == 'eapearson'
            
        # end
        if userdata.has_key? 'affiliations'
            affiliations = userdata['affiliations']
            affiliations.each do |affiliation|
                # some affiliations have been saved with all empty strings.
                # this was a bug in the new profile editor

                # this is a common case.
                if affiliation['title'] == '' &&
                    affiliation['organization'] == '' &&
                    affiliation['started'] == '' &&
                    affiliation['ended'] == ''
                    # puts 'affilitation: ALL EMPTY'
                    next
                end

                # another common case
                if !affiliation.has_key?('title') &&
                    !affiliation.has_key?('organization') &&
                    !affiliation.has_key?('started') &&
                    !affiliation.has_key?('ended')
                    next
                end

                if affiliation.has_key? 'title' 
                    title = affiliation['title']
                    if title.instance_of? String
                        if title == ''
                            puts "title: EMPTY  #{username}, #{affiliation}"
                        end
                    else
                        puts "title: NOT STRING #{username}, #{affiliation}"
                    end
                else
                    # bad!
                    puts "title: MISSING #{username}, #{affiliation}"
                end

                if !affiliation.has_key? 'started'
                    # This is not normal
                    puts "started: MISSING #{username}, #{affiliation}"
                else
                    started = affiliation['started']
                    if started.instance_of? Integer
                        # normal
                    elsif started.nil?
                        puts "started: NIL #{username}, #{affiliation}"
                    elsif started.instance_of? String 
                        if /^[0-9]{4}$/ =~ started
                            started = started.to_i
                            # puts "started: fixed #{username}, #{started}"
                        else
                            puts "started: NOT FIXABLE #{username}, #{started}"
                        end

                    else 
                        puts "started: UNKNOWN #{username}, #{started}, #{started.class}"
                    end
                end
               
                if affiliation.has_key? 'ended'
                    ended = affiliation['ended']
                    if ended.instance_of? Integer
                        # normal
                    elsif ended.nil?
                        # this is not a problem, but we'd prefer to
                        # omit optional and empty properties
                        affiliation.delete 'ended'
                    elsif ended.instance_of? String 
                        # A bad build produced string years. Try to convert
                        # to int.
                        # does it look like a valid year?
                        if ended == 'Present' || ended == ''
                            # This was in the new codebase for a while, so corrupted
                            # profiles. It is the same as null.
                            affiliation.delete 'ended'
                        elsif /^[0-9]{4}$/ =~ ended
                            ended = ended.to_i
                            # puts "ended: fixed #{username}, #{ended}"
                        else
                            puts "ended: NOT FIXABLE #{username}, #{ended}"
                        end

                        # puts "ended: STRING #{username}, #{affiliation}"
                    else 
                        puts "ended: UNKNOWN #{username}, #{ended}, #{ended.class}"
                        # puts "#{username}, #{started}, #{started.class}"
                    end
                end
            end
        end
        
    end
    
end

main

# puts client.get_user_profile ['eapearson']