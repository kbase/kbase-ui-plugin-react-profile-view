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
                if !affiliation.has_key? 'started'
                    # This is normal
                    # puts "started: <missing> #{username}, #{affiliation}"
                else
                    started = affiliation['started']
                    if started == nil
                        puts "started: NIL #{username}, #{affiliation}"
                    elsif started.instance_of? String 
                        puts "started: STRING #{username}, #{affiliation}"
                    else 
                        # puts "#{username}, #{started}, #{started.class}"
                    end
                end
               
                if !affiliation.has_key? 'ended'
                    # this is normal
                    # puts "ended: <missing> #{username}, #{affiliation}"
                else
                    ended = affiliation['ended']
                    if ended == nil
                        # this is normal too
                        # puts "ended: NIL #{username}, #{affiliation}"
                    elsif ended.instance_of? String 
                        puts "ended: STRING #{username}, #{affiliation}"
                    else 
                        # puts "#{username}, #{started}, #{started.class}"
                    end
                end
            end
        end
        
    end
    
end

main

# puts client.get_user_profile ['eapearson']