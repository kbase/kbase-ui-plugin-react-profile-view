require 'net/http'
require 'json'
require 'csv'

class Service 
    def initialize(env, token)
        @env = env
        @token = token
        if env == 'prod'
            @host = 'kbase.us'
        else
            @host = "#{env}.kbase.us"
        end
    end

end

class JSONRPC  < Service
    def initialize(env, token, module_path, module_name)
        super(env, token)
        @module_path = module_path
        @module_name = module_name
    end

    def call(module_function, params=false)
        uri = URI("https://#{@host}/services/#{@module_path}")
        request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
        if params
            request_params = [params]
        else
            request_params = []
        end
        request.body = {
            version: '1.1',
            id: '123',
            method: "#{@module_name}.#{module_function}",
            params: request_params
        }.to_json
        if @token
            request['Authorization'] = @token
        end
        response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
            http.request(request)
        end

        return JSON.parse(response.body)['result'][0]
    end
end

class Rest < Service
    def initialize(env, path, token)
        super(env, token)
        @path = path
    end

    def get(api_path=false)
        if api_path
            uri = URI("https://#{@host}/services/#{@path}/#{api_path}")
        else
            uri = URI("https://#{@host}/services/#{@path}/")
        end

        request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
        request['Accept'] = 'application/json'
        if @token
            request['Authorization'] = @token
        end
        response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
            http.request(request)
        end
        return JSON.parse(response.body)
    end
end

# JSONRPC Services

class Workspace < JSONRPC
    def initialize(env, token)
        super(env, token, 'ws', 'Workspace')
    end

    def ver
        call 'ver'
    end

    def list_workspace_info(params)
        call 'list_workspace_info', params
    end

    def list_objects(params)
        call 'list_objects', params
    end
end

class Catalog < JSONRPC
    def initialize(env)
        super(env, 'catalog', 'Catalog')
    end

    def version
        call 'version'
    end
end

class NMS < JSONRPC
    def initialize(env)
        super(env, 'narrative_method_store/rpc', 'NarrativeMethodStore')
    end

    def ver
        call 'ver'
    end
end

class UserProfile < JSONRPC
    def initialize(env, token)
        super(env, token, 'user_profile/rpc', 'UserProfile')
    end

    def ver
        call 'ver'
    end

    def get_user_profile(params)
        call 'get_user_profile', params
    end

    def filter_users(params) 
        call 'filter_users', params
    end

end

class Search < JSONRPC
    def initialize(env) 
        super(env, 'searchapi', 'KBaseSearchEngine')
    end

    def version
        call('status')['version']
    end
end

class NJS < JSONRPC
    def initialize(env)
        super(env, 'njs_wrapper', 'NarrativeJobService')
    end

    def version
        call('ver')
    end
end

# REST Services

class Feeds < Rest
    def initialize(env)
        super(env, 'feeds')
    end

    def version
        get()['version']
    end
end

class Groups < Rest
    def initialize(env)
        super(env, 'groups')
    end

    def version
        get()['version']
    end
end

class Auth < Rest
    def initialize(env, token)
        super(env, 'auth', token)
    end

    def version
        get()['version']
    end

    def token
        get('api/V2/token')
    end
end